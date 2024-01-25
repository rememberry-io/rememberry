"use client"

import { useEffect } from "react"
import useGetUser from "../_authentication/useGetUser"
import Loading from "../loading";
import { ThemeProviderProps } from "next-themes/dist/types";
import { useRouter } from "next/navigation";

export default function TestGetuser({ children }: ThemeProviderProps) {
  const router = useRouter();
  const { user, isLoading, saveUserData } = useGetUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        saveUserData();
      } else {
        router.push("/testcomponents")
      }
    }
  }, [isLoading, user, saveUserData]);

  return (
    <div>
      {isLoading ? (
        <Loading /> // Show global loading component
      ) : (
        <>
          {children}
        </>
      )}
    </div>
  )
}
