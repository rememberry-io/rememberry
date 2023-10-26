"use client";
import { FormEvent } from "react";
import useCreateUser, { UserCreate } from "../_hooks/createUser";
import { useUserStore } from "../_stores/userStore";

export default function TestButton({}) {
  const userStore = useUserStore();
  const createUser = useCreateUser();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    //@ts-expect-error
    const formdata = new FormData(event.currentTarget);

    const newUser: UserCreate = {
      username: formdata.get("username")?.toString()!,
      password: formdata.get("password")?.toString()!,
      email: formdata.get("email")?.toString()!,
    };

    await createUser({ user: newUser });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "5px" }}
      >
        <input type="text" name="username" placeholder="username" />
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">Create User</button>
      </form>
      {userStore.user && <p>{userStore.user.username}</p>}
      <p>test</p>
    </div>
  );
}
