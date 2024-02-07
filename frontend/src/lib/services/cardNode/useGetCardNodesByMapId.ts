import { FlashcardAndMedia } from "@backend/endPoints/flashcards/types";
import { rqTrpc } from "../trpc/client";

export default function useGetCardNodesByMapId(mapId: string) {
  const fetchStacks = rqTrpc.stacks.getAllByMapId.useQuery(mapId);

  if (fetchStacks.isError) {
    return {
      fetchedStacks: {
        isLoading: false,
        isError: true,
        error: fetchStacks.error,
        stacks: [],
      },
      fetchedFlashcards: {
        isLoading: false,
        isError: false,
        error: null,
        flashcards: [],
      }
    }
  }

  if (fetchStacks.isSuccess) {
    const stacks = fetchStacks.data
    const allFlashcards = stacks.map(stack => {
      const fetchFlashcard = rqTrpc.flashcards.getAllCardsFromStack.useQuery(stack.id)
      if (fetchFlashcard.isError) {

      } else if (fetchFlashcard.isSuccess) {
        return fetchFlashcard.data
      }
    })
  }

}

type FlashcardFetching = {
  isError: boolean,
  data: FlashcardAndMedia
}
