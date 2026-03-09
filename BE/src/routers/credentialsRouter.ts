import { Router } from "express";
import { checkAuth } from "../lib/errors";
import {
  createCredential,
  deleteCredential,
  updateCredential,
  getOne,
  getMany,
  getAll,
} from "../controllers/credentials.controller";

export const credentialsRouter = Router();

credentialsRouter.use(checkAuth);

credentialsRouter.route("/").get(getMany).post(createCredential);
credentialsRouter.route("/all").get(getAll);
credentialsRouter
  .route("/:credentialId")
  .get(getOne)
  .patch(updateCredential)
  .delete(deleteCredential);
