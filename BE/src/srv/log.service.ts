import { LogLevel } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { sendNotificationToUser } from "../service/notifications/notifications";

const create = async function (
  message: string,
  level: LogLevel,
  nodeExecutionId: string,
  userId?: string,
) {
  try {
    await prisma.nodeExecution.findUniqueOrThrow({
      where: { id: nodeExecutionId },
    });

    const log = await prisma.nodeExecutionLog.create({
      data: {
        level,
        message,
        nodeExecutionId,
      },
    });

    // Emit real-time log to the frontend if a userId is available
    if (userId) {
      sendNotificationToUser(userId, "LOG-UPDATE", {
        nodeExecutionId,
        log,
      });
    }

    return log;
  } catch (err) {
    console.log(err);
  }
};

const LogService = { create };
export default LogService;
