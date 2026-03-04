import { catchAsync } from "../lib/errors";
import { prisma } from "../lib/prisma";
import credentialsService from "../srv/credentialsService";
import { CredentialType } from "../generated/prisma/client";
import { generatePaginationObject } from "../utilis/pagination";

export const createCredential = catchAsync(async (req, res, next) => {
  const { name, type, value } = req.body;
  const userId = req.session?.user.id!;
  const credential = await credentialsService.create(name, userId, type, value);

  res.status(201).json({ status: "success", content: credential });
});

export const deleteCredential = catchAsync(async (req, res, next) => {
  const { credentialId } = req.params;
  const userId = req.session?.user.id;
  await credentialsService.delete(credentialId as string, userId as string);
  res.status(204).json({ status: "success" });
});

export const updateCredential = catchAsync(async (req, res, next) => {
  const { credentialId } = req.params;
  const userId = req.session?.user.id;
  const { name, type, value } = req.body;
  const credential = await credentialsService.update(
    credentialId as string,
    userId as string,
    { name, type, value },
  );
  res.status(200).json({ status: "success", content: credential });
});

export const getOne = catchAsync(async (req, res, next) => {
  const { credentialId } = req.params;
  const userId = req.session?.user.id;
  const credential = await credentialsService.readOne(
    credentialId as string,
    userId as string,
  );

  // Sanitizing value for security
  const { value, ...sanitizedCredential } = credential;

  res.status(200).json({ status: "success", content: sanitizedCredential });
});

export const getMany = catchAsync(async (req, res, next) => {
  const { page, size, name, ...filters } = req.query;
  const userId = req.session?.user.id;

  const [content, results] = await Promise.all([
    credentialsService.readMany(Number(page) || 1, Number(size) || 10, {
      ...filters,
      name,
      userId,
    } as any),
    prisma.credential.count({
      where: {
        ...filters,
        userId,
        name: name
          ? {
              contains: name as string,
              mode: "insensitive",
            }
          : undefined,
      } as any,
    }),
  ]);

  res.status(200).json({
    status: "success",
    content,
    results,
    ...generatePaginationObject(
      results,
      Number(page) || 1,
      Number(size) || 10,
      (name as string) || "",
    ),
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const { type } = req.query;
  const userId = req.session?.user.id;
  const credentials = await credentialsService.readAll(
    type as CredentialType,
    userId as string,
  );

  res.status(200).json({ status: "success", content: credentials });
});
