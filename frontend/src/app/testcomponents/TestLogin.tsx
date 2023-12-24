"use client";
import { FormEvent } from "react";
import useLoginUser, { LoginUserInput } from "../_hooks/useLoginUser";
import { useUserStore } from "../_stores/userStore";

export default function TestLogin({}) {
  const userStore = useUserStore();
  const loginUser = useLoginUser();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(event.target)
    //@ts-expect-error
    const formdata = new FormData(event.currentTarget);

    const newUser: LoginUserInput = {
      email: formdata.get("email")?.toString()!,
      password: formdata.get("password")?.toString()!,
    };

    loginUser({ user: newUser });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "5px" }}
      >
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">Log in User</button>
      </form>
      {userStore.user && <p>{userStore.user.username}</p>}
    </div>
  );
}
