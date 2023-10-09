"use client"

import { createUser } from "../hooks/createUser"

export default function TestButton () {
  const userCreate = async () => {
    await createUser()
    console.log("LOL")
  }
  return (
    <div>
      <button onClick={userCreate}>Create User</button>
    </div>
  ) 
}
