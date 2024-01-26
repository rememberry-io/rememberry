import { User } from "./userStore";

type FetchedUser = {
  status: "error" | "successful";
  error?: string;
  user?: User;
};

export async function userLoader(session?: string) {
  if (!session) return null;
  const url = "http://127.0.0.1:3000/api/auth/user?session=" + session;
  const response = await fetch(url);
  const user: FetchedUser = await response.json();

  if (response.status === 400 || !user.user) return null;

  return user.user;
}
