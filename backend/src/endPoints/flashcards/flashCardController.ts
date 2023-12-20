import * as flashcardModels from "./flashcardModels";
import * as types from "./types";

export async function controlCreateFlashcard(flashcard: types.Flashcards) {
  if (flashcard.frontside_media_link || flashcard.backside_media_link) {
    const [errorCheck, newFlashcard] =
      await flashcardModels.createBasicFlashcard(flashcard);
    const [secondErrorCheck, media] =
      await flashcardModels.createMedia(flashcard);
    if (errorCheck || secondErrorCheck) {
      return [errorCheck, null];
    }
    const res = {
      newFlashcard,
      media,
    };
    return [null, res];
  } else {
    const [errorCheck, res] =
      await flashcardModels.createBasicFlashcard(flashcard);
    if (errorCheck) {
      return [errorCheck, null];
    }
    return [null, res];
  }
}

export async function controlUpdateFlashcard(flashcard: types.Flashcards) {
  const [errorCheck, res] = await flashcardModels.updateFlashcard(flashcard);
  if (errorCheck) {
    return [errorCheck, null];
  }
  return [null, res];
}

export async function controlDeleteFlashcard(flashcardId: string) {
  const [errorCheck, res] = await flashcardModels.deleteFlashcard(flashcardId);
  if (errorCheck) {
    return [errorCheck, null];
  }
  return [null, res];
}

export async function controlGetAllFlashcardsFromStack(stackId: string) {
  const [errorCheck, res] =
    await flashcardModels.getAllFlashcardsFromStack(stackId);
  if (errorCheck) {
    return [errorCheck, null];
  }
  return [null, res];
}

export async function controlGetLearnableFlashcardsFromStack(stackId: string) {
  const [errorCheck, res] =
    await flashcardModels.getLearnableFlashcardsFromStack(stackId);
  if (errorCheck) {
    return [errorCheck, null];
  }
  return [null, res];
}

export async function controlgetAllFlashcardsFromStackAndChildStacks(
  stackId: string,
) {
  const [errorCheck, res] =
    await flashcardModels.getAllFlashcardsFromStackAndChildStacks(stackId);
  if (errorCheck) {
    return [errorCheck, null];
  }
  return [null, res];
}

export async function getLearnableFlashcardsFromStackAndChilds(
  stackId: string,
) {
  const [errorCheck, res] =
    await flashcardModels.getLearnableFlashcardsFromStackAndChilds(stackId);
  if (errorCheck) {
    return [errorCheck, null];
  }
  return [null, res];
}
