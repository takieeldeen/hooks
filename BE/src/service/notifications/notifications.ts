import { io } from "../..";
import { NotificationType } from "./types";

export const sendNotificationToUser = async (
  userId: string,
  notifcationType: NotificationType,
  payload: any,
) => {
  io.to(`user:${userId}`).emit(notifcationType, payload);
};
