import { TRPCClientError } from "@trpc/client";
import { RouterInput, RouterOutput, rqTrpc } from "../trpc/client";
import { useCardNodeStore } from "./cardNodeStore";

export type StackCreationInput = RouterInput["stacks"]["create"];
export type RegisterUserOutput = RouterOutput["stacks"]["create"];

export default function useCardNodeCreate() {
  const stackCreator = rqTrpc.stacks.create.useMutation();
  const flashcardCreator = rqTrpc.flashcards.create.useMutation();
  const cardNodeStore = useCardNodeStore();
  const createStack = async (params: { stack: StackCreationInput }) => {
    try {
      const newStack = await stackCreator.mutateAsync(params.stack)

      //cardNodeStore
    } catch (e) {
    }
  }
  return createStack;
}
