"use client";
import { useEffect } from "react";
import { useUserStore } from "../_authentication/userStore";
import TestLogin from "./TestLogin";
import TestLogout from "./TestLogout";
import TestRegister from "./TestRegister";
import { useRouter } from "next/navigation";
import useGetUser from "../_authentication/useGetUser";

export default function TestComponent() {
  const router = useRouter();
  const userStore = useUserStore();

  const { user, isLoading, saveUserData } = useGetUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        saveUserData();
      }
    }
  }, [userStore.isLoading]);

  useEffect(() => {
    if (userStore.user)
      router.push("/logout")
  }, [userStore.user])

  return (
    <div>
      <TestRegister />
      <TestLogin />
    </div>
  );
}
