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
    },
  });
  res.status(201).json({ status: "success", content: workflow });
});

export const getWorkflows = catchAsync(async (req, res, next) => {
  const { page, pageSize, name } = req.query;
  console.log(req.query);
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
