"use client";
import { FormEvent } from "react";
import useRegisterUser, {
  RegisterUserInput,
} from "../_authentication/useRegisterUser";
import { useUserStore } from "../_authentication/userStore";
import { useRouter } from "next/navigation";

export default function TestRegister({ }) {
  const userStore = useUserStore();
  const registerUser = useRegisterUser();

  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(event.target);
    //@ts-expect-error
    const formdata = new FormData(event.currentTarget);

    const newUser: RegisterUserInput = {
      username: formdata.get("username")?.toString()!,
      password: formdata.get("password")?.toString()!,
      email: formdata.get("email")?.toString()!,
    };

    console.log("hello")

    await registerUser({ user: newUser });

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
    </div>
  );
}
