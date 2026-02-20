import { Workflow } from "../generated/prisma/client";
import { NodeType } from "../generated/prisma/enums";
import { catchAsync } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { generatePaginationObject } from "../utilis/pagination";

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
  const workflow = await prisma.workflow.delete({
    where: {
      id: workflowId as string,
      userId: userId as string,
    },
  });
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

export const updateWorkflow = catchAsync(async (req, res, next) => {
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
