import { catchAsync } from "../lib/errors";
import { prisma } from "../lib/prisma";

export const createWorkflow = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.session?.user.id;
  const workflow = await prisma.workflow.create({
    data: {
      name: name as string,
      userId: userId as string,
    },
  });
  res.status(201).json({ status: "success", content: workflow });
});

export const getWorkflows = catchAsync(async (req, res, next) => {
  const userId = req.session?.user.id;
  const workflows = await prisma.workflow.findMany({
    where: {
      userId: userId as string,
    },
  });
  res.status(200).json({ status: "success", content: workflows });
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
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId as string,
      userId: userId as string,
    },
  });
  res.status(200).json({ status: "success", content: workflow });
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
