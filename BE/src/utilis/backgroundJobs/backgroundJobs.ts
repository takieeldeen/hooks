import { prisma } from "../../lib/prisma";
import { sendNotificationToUser } from "../../service/notifications/notifications";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

type JobFn<T = any> = (payload: T) => Promise<any>;

interface QueueEntry<T = any> {
  jobName: string;
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
    jobName: string,
    jobFn: JobFn<T>,
    payload?: T,
  ): void {
    // Initialise queue for this workflow if needed
    if (!this.userId) this.userId = userId;
    if (!this.queues.has(workflowId)) {
      this.queues.set(workflowId, []);
    }

    this.queues.get(workflowId)!.push({ jobName, jobFn, payload });

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
    const queue = this.queues.get(workflowId);
    if (!queue || queue.length === 0) {
      // Nothing left – mark as idle and clean up the empty queue
      this.running.set(workflowId, false);
      this.queues.delete(workflowId);
      return;
    }

    this.running.set(workflowId, true);
    const entry = queue.shift()!; // take the first job

    await this.executeJob(entry);

    // Immediately move to the next job in this workflow's queue
    await this.runNext(workflowId);
  }

  /** Runs a single job: persists status transitions to the DB. */
  private async executeJob({
    jobName,
    jobFn,
    payload,
  }: QueueEntry): Promise<void> {
    // 1. Create the job record as PENDING
    const job = await prisma.job.create({
      data: {
        name: jobName,
        status: "PENDING",
        payload: payload ?? null,
      },
    });

    // 2. Mark as RUNNING
    const runningPayload = { status: "RUNNING" };
    await prisma.job.update({
      where: { id: job.id },
      data: runningPayload,
    });
    sendNotificationToUser(this.userId!, "NODE-UPDATE", {
      nodeId: payload?.nodeId,
      status: "RUNNING",
    });

    // 3. Execute and store result / error
    try {
      const result = await jobFn(payload);
      const succcessPayload = { status: "SUCCESS", result };
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "SUCCESS", result },
      });
      sendNotificationToUser(this.userId!, "NODE-UPDATE", {
        nodeId: payload?.nodeId,
        status: "SUCCESS",
      });
    } catch (err: any) {
      const failurePayload = { status: "FAILED", error: JSON.stringify(err) };
      await prisma.job.update({
        where: { id: job.id },
        data: failurePayload,
      });
      sendNotificationToUser(this.userId!, "NODE-UPDATE", {
        nodeId: payload?.nodeId,
        status: "FAILED",
      });
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
  jobName: string,
  jobFn: JobFn<T>,
  payload?: T,
): void {
  jobQueue.enqueue(userId, workflowId, jobName, jobFn, payload);
}
