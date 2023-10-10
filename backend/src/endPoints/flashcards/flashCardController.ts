import * as schema from "../../db/schema";
import * as types from "./types";
import * as flashcardModels from "./flashcardModels";


export async function controlCreateFlashcard(flashcard:types.Flashcards, db:types.dbConnection){
    if(flashcard.frontside_media_link && flashcard.backside_media_link){
         const res = await flashcardModels.createFlashcardWithMedia(flashcard, db)
         return res
    }else if(flashcard.frontside_media_link && !flashcard.backside_media_link){
        const res = await flashcardModels.createFlashcardWithFrontsideMedia(flashcard, db)
        return res
    }else if(flashcard.backside_media_link && !flashcard.frontside_media_link){
        const res = await flashcardModels.createFlashcardWithBackideMedia(flashcard, db)
        return res
    }
}


export async function controlUpdateFlashcard(
  flashcard: types.Flashcards,
  db: types.dbConnection
) {
  const res = await flashcardModels.updateFlashcard(flashcard, db);
  return res;
}


export async function controlDeleteFlashcard(
  flashcardId: string,
  db: types.dbConnection
) {
  const res = await flashcardModels.deleteFlashcard(flashcardId, db);
  return res;
}


export async function controlGetAllFlashcardsFromStack(
  stackId: string,
  db: types.dbConnection
) {
  const res = flashcardModels.getAllFlashcardsFromStack(stackId, db);
  return res;
}


export async function controlGetLearnableFlashcardsFromStack(
  stackId: string,
  db: types.dbConnection
) {
  const res = flashcardModels.getLearnableFlashcardsFromStack(stackId, db);
  return res;
}


export async function controlgetAllFlashcardsFromStackAndChildStacks(
  stackId: string,
  db: types.dbConnection
) {
  const res = await flashcardModels.getAllFlashcardsFromStackAndChildStacks(
    stackId,
    db
  );
  return res;
}

export async function getLearnableFlashcardsFromStackAndChilds(
  stackId: string,
  db: types.dbConnection
) {
  const res = flashcardModels.getLearnableFlashcardsFromStackAndChilds(
    stackId,
    db
  );
  return res;
}
