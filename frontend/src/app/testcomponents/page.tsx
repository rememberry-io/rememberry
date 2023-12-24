"use client"
import { useUserStore } from "../_stores/userStore";
import TestLogin from "./TestLogin";
import TestLogout from "./TestLogout";
import TestRegister from "./TestRegister";

export default function TestComponent() {
  const userStore = useUserStore();
  return (
    <div>
      {userStore.user ? (
        <TestLogout />
      ) : (
        <div>
          <TestRegister />
          <TestLogin />
        </div>
      )}
    </div>
  );
}
