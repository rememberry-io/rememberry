// import { TRPCClientError } from "@trpc/client";
// import { RouterInput, RouterOutput, rqTrpc } from "../trpc/client";

// export type StackCreationInput = RouterInput["stacks"]["create"];
// export type RegisterUserOutput = RouterOutput["stacks"]["create"];

// export default function useStackCreate() {
//   const userCreator = rqTrpc.stacks.create.useMutation();
//   const userStore = useUserStore();
//   const registerUser = async (params: { stack: StackCreationInput }) => {
//     try {
//       const newUser = await userCreator.mutateAsync(params.stack);

//       userStore.actions.setUser(newUser);
//     } catch (error) {
//       if (error instanceof TRPCClientError) console.error(error);
//       else console.error(error);
//     }
//   };
//   return registerUser;
// }
