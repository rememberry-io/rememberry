import * as schema from "../../db/schema";
import * as types from "./types";
import * as flashcardModels from "./flashcardModels";

export async function controlCreateFlashcard(
  flashcard: schema.NewFlashcard,
  db: types.dbConnection
) {
  const res = flashcardModels.createFlashcard(flashcard, db);
  return res;
}

export async function controlUpdateFlashcard(
  flashcard: schema.Flashcard,
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
