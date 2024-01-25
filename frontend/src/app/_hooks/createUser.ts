// import { TRPCClientError } from "@trpc/client";
// import { useUserStore } from "../_stores/userStore";
// import { RouterInput, RouterOutput, rqTrpc } from "../_trpc/client";

// interface UserModel {
//   // create: RouterInput["user"]["createUser"];
//   // update: RouterInput["user"]["updateUser"];
//   // delete: RouterInput["user"]["updateUser"];

// }

// export type test = RouterInput["user"];

// // export type UserCreate = RouterInput["user"]["createUser"];
// // export type UserUpdate = RouterInput["user"]["createUser"];
// // export type UserCreateOut = RouterOutput["user"]["createUser"];

// export type OutputUser = {
//   username: string;
//   email: string;
//   password: string;
//   user_id?: string | undefined;
//   refresh_token?: string;
// };

// export default function useCreateUser() {
//   //const userCreator = rqTrpc.user.createUser.useMutation();
//   const userStore = useUserStore();
//   const createUser = async (params: { user: string }) => {
//     try {
//       //const createUser = await userCreator.mutateAsync(params.user);

//       //userStore.actions.setUser(createUser);
//     } catch (error) {
//       if (error instanceof TRPCClientError) console.log(error.data.httpStatus);
//       else console.log(error);
//     }
//     return "test";
//   };
//   return createUser;
// }
