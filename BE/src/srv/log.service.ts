import { LogLevel } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

const create = async function (
  message: string,
  level: LogLevel,
  executionId: string,
) {
  try {
    const logExist = await prisma.nodeExecution.findUnique({
      where: {
        id: executionId,
      },
    });
    console.log(logExist, "logExisted");
    const log = await prisma.nodeExecutionLog.create({
      data: {
        level,
        message,
        nodeExecutionId: executionId,
      },
    });
    return log;
  } catch (err) {
    console.log(err);
  }
};

const LogService = { create };
export default LogService;
