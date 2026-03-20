import { NodeExecution } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { sendNotificationToUser } from "../../service/notifications/notifications";
import LogService from "../../srv/log.service";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

type JobFn<T = any> = (payload: T, userId?: string) => Promise<any>;

interface QueueEntry<T = any> {
  jobName: string;
  executionId: string;
  nodeExecutionId: string;
  jobFn: JobFn<T>;
  payload?: T;
}

// --------------------------------------------------------------------------
// BackgroundJobQueue
// --------------------------------------------------------------------------
// Jobs for the SAME workflowId are executed one-at-a-time (sequential).
// Jobs for DIFFERENT workflowIds run concurrently (each has its own queue).
// registerJob() is fire-and-forget – it never blocks the caller.
// --------------------------------------------------------------------------

class BackgroundJobQueue {
  /** workflowId → array of pending jobs */
  private queues = new Map<string, QueueEntry[]>();
  /** workflowId → whether a job is currently being processed */
  private running = new Map<string, boolean>();
  private userId: string | undefined;

  /**
   * Enqueue a job.
   * @param workflowId  Used to group jobs that must run sequentially.
   * @param jobName     Human-readable label stored in the DB.
   * @param jobFn       The async function to execute.
   * @param payload     Optional data forwarded to jobFn.
   */
  enqueue<T = any>(
    userId: string,
    workflowId: string,
    executionId: string,
    nodeExecutionId: string,
    jobName: string,
    jobFn: JobFn<T>,
    payload?: T,
  ): void {
    // Initialise queue for this workflow if needed
    if (!this.userId) this.userId = userId;
    if (!this.queues.has(workflowId)) {
      this.queues.set(workflowId, []);
    }

    this.queues
      .get(workflowId)!
      .push({ jobName, nodeExecutionId, executionId, jobFn, payload });

    // Start processing if nothing is running for this workflow
    if (!this.running.get(workflowId)) {
      this.processQueue(workflowId);
    }
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  /** Process the queue for a given workflowId sequentially. */
  private processQueue(workflowId: string): void {
    // Runs fully in the background – intentionally not awaited by callers
    this.runNext(workflowId).catch((err) => {
      console.error(
        `[BackgroundJobQueue] Unexpected error for workflow ${workflowId}:`,
        err,
      );
    });
  }

  private async runNext(workflowId: string): Promise<void> {
    try {
      const queue = this.queues.get(workflowId);
      if (!queue || queue.length === 0) {
        // Nothing left – mark as idle and clean up the empty queue
        this.running.set(workflowId, false);
        this.queues.delete(workflowId);
        return;
      }

      this.running.set(workflowId, true);
      const entry = queue.shift()!; // take the first job
      if (entry.executionId) {
        await LogService.create(
          `Execution Environment created succesfully`,
          "INFO",
          entry.nodeExecutionId,
          this.userId,
        );
      }
      const status = await this.executeJob(entry);
      await LogService.create(
        "Node Executed Successfuly",
        "INFO",
        entry.nodeExecutionId,
        this.userId,
      );
      // After executing, check if this execution has more jobs in the queue
      const hasMoreForExecution = queue.some(
        (q) => q.executionId === entry.executionId,
      );

      if (status === "FAILED") {
        // Remove any remaining jobs for this executionId so they don't run
        const remainingJobs = queue.filter(
          (q) => q.executionId !== entry.executionId,
        );
        this.queues.set(workflowId, remainingJobs);

        await prisma.workflowExecution.update({
          where: { id: entry.executionId },
          data: { status: "FAILED", completedAt: new Date() },
        });
      } else if (!hasMoreForExecution) {
        // It succeeded and it was the last job for this executionId
        await prisma.workflowExecution.update({
          where: { id: entry.executionId },
          data: { status: "COMPLETED", completedAt: new Date() },
        });
      }

      // Immediately move to the next job in this workflow's queue
      await this.runNext(workflowId);
    } catch (err) {
      console.log(err);
    }
  }

  /** Runs a single job: persists status transitions to the DB. */
  private async executeJob({
    jobName,
    executionId,
    nodeExecutionId,
    jobFn,
    payload,
  }: QueueEntry): Promise<"SUCCESS" | "FAILED"> {
    // 1. Create the job record as PENDING
    const payloadToSave =
      payload && typeof payload === "object" ? { ...payload } : payload;
    if (payloadToSave && typeof payloadToSave === "object") {
      delete (payloadToSave as any).functionContext;
    }
    const job = await prisma.job.create({
      data: {
        name: jobName,
        status: "PENDING",
        payload: payloadToSave ?? null,
      },
    });

    // const nodeId = (payload as any)?.nodeId;
    let nodeExecutionData: NodeExecution | undefined;
    nodeExecutionData = await prisma.nodeExecution.update({
      where: { id: nodeExecutionId },
      data: {
        status: "RUNNING",
        startedAt: new Date(),
        inputs: payloadToSave ?? {},
      },
      include: {
        logs: true,
        node: true,
      },
    });

    // 2. Mark as RUNNING
    const runningPayload = { status: "RUNNING" };
    await prisma.job.update({
      where: { id: job.id },
      data: runningPayload,
    });
    sendNotificationToUser(this.userId!, "NODE-UPDATE", {
      nodeId: (payload as any)?.nodeId,
      status: "RUNNING",
      executionData: nodeExecutionData,
    });

    // 3. Execute and store result / error
    try {
      if (payload && typeof payload === "object") {
        (payload as any).nodeExecutionId = nodeExecutionId;
      }
      const result = await jobFn(payload, this.userId);
      const { context: updatedContext, output: nodeOutput } = result;

      // Update the context in the payload for subsequent steps that share the same reference
      if (payload && typeof payload === "object" && (payload as any).context) {
        (payload as any).context = updatedContext;
      }

      await prisma.job.update({
        where: { id: job.id },
        data: { status: "SUCCESS", result: nodeOutput as any },
      });
      nodeExecutionData = await prisma.nodeExecution.update({
        where: { id: nodeExecutionId },
        data: {
          status: "SUCCESS",
          completedAt: new Date(),
          inputs: payloadToSave ?? {},
          outputs:
            typeof nodeOutput === "object" ? (nodeOutput ?? {}) : { nodeOutput },
        },
        include: {
          node: true,
          logs: true,
        },
      });
      sendNotificationToUser(this.userId!, "NODE-UPDATE", {
        nodeId: (payload as any)?.nodeId,
        status: "SUCCESS",
        executionData: nodeExecutionData,
      });
      return "SUCCESS";
    } catch (err: any) {
      console.log(err);
      const failurePayload = { status: "FAILED", error: JSON.stringify(err) };
      await prisma.job.update({
        where: { id: job.id },
        data: failurePayload,
      });
      let nodeExecutionData: NodeExecution | undefined;
      nodeExecutionData = await prisma.nodeExecution.update({
        where: { id: nodeExecutionId },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          inputs: payloadToSave ?? {},
          outputs: { error: err.message || JSON.stringify(err) },
        },
        include: {
          node: true,
          logs: true,
        },
      });
      sendNotificationToUser(this.userId!, "NODE-UPDATE", {
        nodeId: (payload as any)?.nodeId,
        status: "FAILED",
        executionData: nodeExecutionData,
      });
      return "FAILED";
    }
  }
}

// --------------------------------------------------------------------------
// Singleton – one queue manager for the whole process
// --------------------------------------------------------------------------
const jobQueue = new BackgroundJobQueue();

// --------------------------------------------------------------------------
// Public API
// --------------------------------------------------------------------------

/**
 * Register a background job.
 *
 * The job is queued immediately and executed in the background.
 * If multiple jobs are registered for the same `workflowId`, they will be
 * executed one-after-the-other (sequentially).
 * If jobs target different `workflowId`s they run in parallel.
 *
 * This function returns immediately (fire-and-forget) so it never blocks
 * the HTTP response.
 */
export function registerJob<T = any>(
  userId: string,
  workflowId: string,
  executionId: string,
  nodeExecutionId: string,
  jobName: string,
  jobFn: JobFn<T>,
  payload?: T,
): void {
  jobQueue.enqueue(
    userId,
    workflowId,
    executionId,
    nodeExecutionId,
    jobName,
    jobFn,
    payload,
  );
}
