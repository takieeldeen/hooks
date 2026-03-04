import { Credential, CredentialType } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

async function createCredential(
  name: string,
  userId: string,
  type: CredentialType,
  value: string,
) {
  const credentialData = { name, value, userId, type };
  console.log(credentialData);
  return await prisma.credential.create({
    data: credentialData,
  });
}

async function getCredential(credentialId: string, userId: string) {
  return await prisma.credential.findFirstOrThrow({
    where: {
      id: credentialId,
      userId,
    },
  });
}

async function getAllCredentials(
  page: number = 1,
  size: number = 9,
  filters: Partial<Credential> = {},
) {
  return await prisma.credential.findMany({
    skip: (page - 1) * size,
    take: size,
    where: {
      ...filters,
      name: filters?.name
        ? {
            contains: filters?.name,
            mode: "insensitive",
          }
        : undefined,
    },
  });
}

async function deleteCredential(credentialId: string, userId: string) {
  return await prisma.credential.delete({
    where: {
      id: credentialId,
      userId,
    },
  });
}

async function updateCredential(
  credentialId: string,
  userId: string,
  updatedData: Partial<Credential>,
) {
  return await prisma.credential.update({
    where: {
      id: credentialId,
      userId,
    },
    data: updatedData,
  });
}

async function getCredentialsValueHelp(type: CredentialType, userId: string) {
  return await prisma.credential.findMany({
    where: {
      type,
      userId,
    },
  });
}

const credentialsService = {
  create: createCredential,
  update: updateCredential,
  delete: deleteCredential,
  readOne: getCredential,
  readMany: getAllCredentials,
  readAll: getCredentialsValueHelp,
};

export default credentialsService;
