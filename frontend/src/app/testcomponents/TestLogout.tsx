"use client";
import { useRouter } from "next/navigation";
import useLogoutUser from "../_authentication/useLogoutUser";

export default function TestLogout() {
  const router = useRouter();
  const logout = useLogoutUser();
  async function onClickLogout(event: any) {
    event.preventDefault();

    const [error, success] = await logout();

    if (error)
      return;

    router.push("/testcomponents")
  }
  return (
    <div>
      <button onClick={onClickLogout}>Logout</button>
    </div>
  );
}
