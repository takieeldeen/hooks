import { AppConnection, AppConnectionType } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

async function create(
  connection: Omit<AppConnection, "id" | "createdAt" | "updatedAt">,
) {
  return await prisma.appConnection.create({
    data: connection,
  });
}

async function remove(connectionId: string, userId: string) {
  return await prisma.appConnection.delete({
    where: {
      id: connectionId,
      userId,
    },
  });
}

async function geAllUserConnections(
  userId: string,
  type?: AppConnectionType | undefined,
) {
  return await prisma.appConnection.findMany({
    where: {
      userId,
      type,
    },
  });
}

const appConnectionService = {
  create,
  delete: remove,
  getUserConnections: geAllUserConnections,
};

export default appConnectionService;
