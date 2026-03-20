import { NodeType } from "../generated/prisma/enums";
import { catchAsync } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { generatePaginationObject } from "../utilis/pagination";
import WorkflowService from "../srv/workflowsService";

export const createWorkflow = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.session?.user.id;
  const workflow = await prisma.workflow.create({
    data: {
      name: name as string,
      userId: userId as string,
      nodes: {
        create: {
          type: NodeType.INITIAL,
          position: { x: 0, y: 0 },
          name: NodeType.INITIAL,
        },
      },
    },
  });
  res.status(201).json({ status: "success", content: workflow });
});

export const getWorkflows = catchAsync(async (req, res, next) => {
  const { page, pageSize, name } = req.query;
  const userId = req.session?.user.id;
  const [content, results] = await Promise.all([
    prisma.workflow.findMany({
      skip: (+page! - 1) * +pageSize!,
      take: +pageSize!,
      where: {
        userId: userId as string,
        name: {
          contains: name as string,
          mode: "insensitive",
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.workflow.count({
      where: {
        userId,
        name: {
          contains: name as string,
          mode: "insensitive",
        },
      },
    }),
  ]);
  res.status(200).json({
    status: "success",
    content,
    results,
    ...generatePaginationObject(results, +page!, +pageSize!, name! as string),
  });
});

export const deleteWorkflow = catchAsync(async (req, res, next) => {
  const { workflowId } = req.params;
  const userId = req.session?.user.id;
  const workflow = await WorkflowService.delete(
    workflowId as string,
    userId as string,
  );
  res.status(200).json({ status: "success", content: workflow });
});

export const getWorkflow = catchAsync(async (req, res, next) => {
  const { workflowId } = req.params;
  const userId = req.session?.user.id;
  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: {
      id: workflowId as string,
      userId: userId as string,
    },
    include: {
      nodes: true,
      connections: true,
    },
  });
  const nodes = workflow.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
  }));

  const edges = workflow.connections.map((connection) => ({
    id: connection.id,
    source: connection.sourceNodeId,
    target: connection.targetNodeId,
    sourceHandle: connection.sourceInput,
    targetHandle: connection.targetInput,
  }));
  const finalObj: any = { ...workflow, nodes, edges };
  delete finalObj.connections;
  res.status(200).json({ status: "success", content: finalObj });
});

export const updateWorkflowName = catchAsync(async (req, res, next) => {
  const { workflowId } = req.params;
  const userId = req.session?.user.id;
  const workflow = await prisma.workflow.update({
    where: {
      id: workflowId as string,
      userId: userId as string,
    },
    data: {
      name: req.body.name as string,
    },
  });
  res.status(200).json({ status: "success", content: workflow });
});

export const updateWorkflow = catchAsync(async (req, res, next) => {
  const { workflowId } = req.params;
  const { nodes, edges } = req.body;
  const userId = req.session?.user.id;

  await prisma.$transaction(async (transaction) => {
    await transaction.node.deleteMany({
      where: {
        workflowId: workflowId as string,
      },
    });

    await transaction.node.createMany({
      data: nodes.map((node: any) => ({
        id: node.id,
        workflowId,
        name: node.type || "unkown",
        type: node.type as NodeType,
        position: node.position,
        data: node.data || {},
      })),
    });

    await transaction.connection.createMany({
      data: edges.map((edge: any) => ({
        workflowId,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        sourceInput: edge.sourceHandle || "main",
        targetInput: edge.targetHandle || "main",
      })),
    });

    await transaction.workflow.update({
      where: {
        id: workflowId as string,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  });

  res.status(200).json({
    status: "success",
  });
});

export const executeWorkflow = catchAsync(async (req, res, next) => {
  // 0. Get the workflowId from params
  const { workflowId } = req.params;
  const { initialData } = req.body ?? {};
  console.log("triggered");
  // 1. Execute Workflow
  const { context, executionId } = await WorkflowService.execute(
    workflowId as string,
    initialData,
    req.session?.user.id!,
  );

  // 2. Return immediately so the client is not kept waiting
  res.status(202).json({
    status: "success",
    message: "Workflow execution has been queued.",
    workflowId,
    context,
    executionId,
  });
});
