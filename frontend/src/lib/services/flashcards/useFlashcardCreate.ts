// export type CreateFlashcardInput = RouterInput["flashcards"]["createFlashcard"];

// export default function useAddFlashcard() {
//   const flashcardCreator = rqTrpc.flashcards.createFlashcard.useMutation();
//   const userStore = useUserStore();
//   const registerUser = async (params: { user: RegisterUserInput }) => {
//     try {
//       const newUser = await flashcardCreator.mutateAsync(params.user);

//       userStore.actions.setUser(newUser);
//     } catch (error) {
//       if (error instanceof TRPCClientError) console.error(error);
//       else console.error(error);
//     }
//   };
//   return registerUser;

// }
