"use client"
import React, { FormEvent } from "react"
import { UserCreate, userHooks } from "../hooks/createUser"

export default function TestButton({ }) {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //@ts-ignore
    const formdata = new FormData(event.currentTarget)

    const user: UserCreate = {
      username: formdata.get("username")?.toString()!,
      password: formdata.get("password")?.toString()!,
      email: formdata.get("email")?.toString()!
    } 
    console.log(user)
    await userHooks.createUser(user)
  }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <input type="text" name="username" placeholder="username" />
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">Create User</button>
      </form>
    </div>
  )
}
