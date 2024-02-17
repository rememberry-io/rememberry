import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import * as peerController from "./peersController";
import * as types from "./types";

export const peerRouter = router({
  create: privateProcedure
    .input(types.peerCreationSchema)
    .mutation(async (opts) => {
      const [error, res] = await peerController.controlPeerCreation(
        opts.input.userId,
        opts.input.peerName,
      );
      if (error) {
        throw error;
      }
      return res;
    }),

  updateName: privateProcedure.input(types.peer).mutation(async (opts) => {
    const [error, res] = await peerController.controlUpdatePeerName(
      opts.input.peerName,
      opts.input.peerId,
      opts.input.userId,
    );
    if (error) {
      throw error;
    }
    return res;
  }),

  kickUser: privateProcedure
    .input(types.kickUserSchema)
    .mutation(async (opts) => {
      const [error, res] = await peerController.controlKick(
        opts.input.kickerId,
        opts.input.kickedUserId,
        opts.input.peerId,
      );
      if (error) {
        throw error;
      }
      return res;
    }),

  removeAdminStatus: privateProcedure
    .input(types.kickUserSchema)
    .mutation(async (opts) => {
      const [error, res] = await peerController.controlRemoveAdminStatus(
        opts.input.kickedUserId,
        opts.input.peerId,
        opts.input.kickerId,
      );
      if (error) {
        throw error;
      }
      return res;
    }),

  addAdminStatus: privateProcedure
    .input(types.kickUserSchema)
    .mutation(async (opts) => {
      const [error, res] = await peerController.controlAddAdminStatus(
        opts.input.kickedUserId,
        opts.input.peerId,
        opts.input.kickerId,
      );
      if (error) {
        throw error;
      }
      return res;
    }),
});
