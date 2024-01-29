import { IncomingMessage, ServerResponse } from "http";
import { User } from "lucia";
import { z } from "zod";

export const UpdateUsernameAndEmailRouteInput = z.object({
  userId: z.string(),
  email: z.string(),
  username: z.string(),
});

export const UpdatePasswordRouteInput = z.object({
  email: z.string(),
  newPassword: z.string(),
});

export type GetUserBySessionInput = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
};

export type UpdateUsernameAndEmailInput = {
  userId: string;
  username: string;
  email: string;
};

export type UpdatePasswordInput = {
  email: string;
  newPassword: string;
};

export type UserControllerOutput = {
  user: User;
};

export const UserRouterOutput = z.object({
  username: z.string(),
  email: z.string(),
  id: z.string(),
});
