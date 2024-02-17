import { Flashcard } from "../../db/schema";
import { PromiseTStatus, getTRPCError } from "../../utils";
import { MediaModel, mediaModelDrizzle } from "../media/media.model";
import { FlashcardModel, flashcardModelDrizzle } from "./flashcard.model";
import { CreateFlashcard, FlashcardAndMedia } from "./types";

export interface FlashcardController {
  createFlashcard: (
    input: CreateFlashcard,
  ) => PromiseTStatus<FlashcardAndMedia>;
  updateFlashcardById: (input: FlashcardAndMedia) => PromiseTStatus<Flashcard>;
  getAllFlashcardsByStackId: (
    stackId: string,
  ) => PromiseTStatus<FlashcardAndMedia[]>;
  getLearnableFlashcardsByStackId: (
    stackId: string,
  ) => PromiseTStatus<FlashcardAndMedia[]>;
  getAllFlashcardsFromStackAndChildrenStacks: (
    stackId: string,
  ) => PromiseTStatus<FlashcardAndMedia[]>;
  getLearnableFlashcardsFromStackAndChildren: (
    stackId: string,
  ) => PromiseTStatus<FlashcardAndMedia[]>;
  deleteFlashcardById: (id: string) => PromiseTStatus<Flashcard>;
}

class FlashcardControllerDrizzle implements FlashcardController {
  flashcardModel: FlashcardModel;
  mediaModel: MediaModel;
  constructor(flashcardModel: FlashcardModel, mediaModel: MediaModel) {
    this.flashcardModel = flashcardModel;
    this.mediaModel = mediaModel;
  }
  async createFlashcard(input: CreateFlashcard) {
    if (!input.media) {
      const [err, flashcard] = await this.flashcardModel.createFlashcard(
        input.flashcard,
      );
      if (err) return getTRPCError(err.message, err.code);
      return [null, { flashcard, media: null }] as const;
    }

    const [flashcardErr, flashcard] = await this.flashcardModel.createFlashcard(
      input.flashcard,
    );
    if (flashcardErr)
      return getTRPCError(flashcardErr.message, flashcardErr.code);
    const [mediaErr, media] = await this.mediaModel.createMedia(
      input.flashcard,
    );
    if (mediaErr) return getTRPCError(mediaErr.message, mediaErr.code);

    return [null, { flashcard, media }] as const;
  }
  async getAllFlashcardsByStackId(stackId: string) {
    return this.flashcardModel.getAllFlashcardsByStackId(stackId);
  }

  async getLearnableFlashcardsByStackId(stackId: string) {
    return this.flashcardModel.getLearnableFlashcardsByStackId(stackId);
  }

  async getAllFlashcardsFromStackAndChildrenStacks(stackId: string) {
    return this.flashcardModel.getAllFlashcardsFromStackAndChildrenStacks(
      stackId,
    );
  }

  async getLearnableFlashcardsFromStackAndChildren(stackId: string) {
    return this.flashcardModel.getLearnableFlashcardsFromStackAndChildren(
      stackId,
    );
  }

  async updateFlashcardById(input: FlashcardAndMedia) {
    return this.flashcardModel.updateFlashcardById(input);
  }
  async deleteFlashcardById(id: string) {
    return this.flashcardModel.deleteFlashcardById(id);
  }
}

export const flashcardControllerDrizzle = new FlashcardControllerDrizzle(
  flashcardModelDrizzle,
  mediaModelDrizzle,
);
