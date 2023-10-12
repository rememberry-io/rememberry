import * as schema from "../../db/schema";
import * as types from "./types";
import * as flashcardModels from "./flashcardModels";
import { database } from "../user/user.model";


export async function controlCreateFlashcard(flashcard:types.Flashcards){
    if(flashcard.frontside_media_link && flashcard.backside_media_link){
         const res = await flashcardModels.createFlashcardWithMedia(flashcard)
         return res
    }else if(flashcard.frontside_media_link && !flashcard.backside_media_link){
        const res = await flashcardModels.createFlashcardWithFrontsideMedia(flashcard)
        return res
    }else if(flashcard.backside_media_link && !flashcard.frontside_media_link){
        const res = await flashcardModels.createFlashcardWithBackideMedia(flashcard)
        return res
    }
}


export async function controlUpdateFlashcard(
  flashcard: types.Flashcards
) {
  const res = await flashcardModels.updateFlashcard(flashcard);
  return res;
}


export async function controlDeleteFlashcard(
  flashcardId: string
) {
  const res = await flashcardModels.deleteFlashcard(flashcardId);
  return res;
}


export async function controlGetAllFlashcardsFromStack(
  stackId: string
) {
  const res = flashcardModels.getAllFlashcardsFromStack(stackId);
  return res;
}


export async function controlGetLearnableFlashcardsFromStack(
  stackId: string
) {
  const res = flashcardModels.getLearnableFlashcardsFromStack(stackId);
  return res;
}


export async function controlgetAllFlashcardsFromStackAndChildStacks(
  stackId: string
) {
  const res = await flashcardModels.getAllFlashcardsFromStackAndChildStacks(
    stackId
  );
  return res;
}

export async function getLearnableFlashcardsFromStackAndChilds(
  stackId: string
) {
  const res = flashcardModels.getLearnableFlashcardsFromStackAndChilds(
    stackId
  );
  return res;
}
