"use client"
import useLogoutUser from "../_hooks/useLogoutUser";

export default function TestLogout() {
  const logout = useLogoutUser();
  function onClickLogout(event: any) {
    event.preventDefault();

    logout();
  }
  return (
    <div>
      <button onClick={onClickLogout}>Logout</button>
    </div>
  );
}
