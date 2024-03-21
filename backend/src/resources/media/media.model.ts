import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { DrizzleDB, db } from "../../db/db";
import { Media, NewMedia, media } from "../../db/schema";
import { PromiseTStatus, catchDrizzleErrorOneEntry } from "../../utils";

export interface MediaModel {
  createMedia: (input: NewMedia) => PromiseTStatus<Media>;
  getMediaById: (id: string) => PromiseTStatus<Media>;
  updateMediaById: (input: Media) => PromiseTStatus<Media>;
  deleteMediaById: (id: string) => PromiseTStatus<Media>;
}

class MediaModelDrizzle implements MediaModel {
  db: DrizzleDB;
  constructor(db: DrizzleDB) {
    this.db = db;
  }
  async createMedia(input: NewMedia) {
    return catchDrizzleErrorOneEntry(() =>
      this.db.drizzle.insert(media).values(input).returning(),
    );
  }
  async getMediaById(id: string) {
    return catchDrizzleErrorOneEntry(() =>
      this.db.drizzle.select().from(media).where(eq(media.id, id)),
    );
  }

  async updateMediaById(input: Media) {
    return catchDrizzleErrorOneEntry(() =>
      this.db.drizzle
        .update(media)
        .set({ ...input, updatedAt: dayjs().toDate() })
        .where(eq(media.id, input.id))
        .returning(),
    );
  }
  async deleteMediaById(id: string) {
    return catchDrizzleErrorOneEntry(() =>
      this.db.drizzle.delete(media).where(eq(media.id, id)).returning(),
    );
  }
}

export const mediaModelDrizzle = new MediaModelDrizzle(db);
