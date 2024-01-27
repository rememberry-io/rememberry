"use client";
import { ReactNode } from "react";
import { User } from "../../lib/services/authentication/userStore";

interface FetchUserProps {
  user: User | null;
  children: ReactNode;
}

export default function FetchUser({ user, children }: FetchUserProps) {
  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);

  // const userStore = useUserStore();

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/login");
  //     userStore.actions.deleteUser();
  //   } else {
  //     userStore.actions.setUser(user);
  //   }
  //   setIsLoading(false);
  // }, [user, router, userStore.actions]);

  // if (isLoading) return <Loading />;

  return <>{children}</>;
}
