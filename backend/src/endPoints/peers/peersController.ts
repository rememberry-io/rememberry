import * as peersModels from "./peersModels";

export async function controlPeerCreation(userId: string, peerName: string) {
  const peerId = await peersModels.createPeer(peerName);
  const res = await peersModels.createUsersPeersRelation(peerId, userId);
  return res;
}

export async function controlUpdatePeerName(
  newPeerName: string,
  peerId: string,
  userId: string,
) {
  const adminStatus = await peersModels.checkIfMemberIsAdmin(userId, peerId);
  if (adminStatus) {
    const res = await peersModels.updatePeerName(newPeerName, peerId);
    return res;
  }
  const error = new Error("UNAUTHORIZED");
  return [adminStatus, error];
}

export async function controlKick(
  kickerId: string,
  kickedUserId: string,
  peerId: string,
) {
  const adminStatus = await peersModels.checkIfMemberIsAdmin(kickerId, peerId);
  if (adminStatus) {
    const res = peersModels.kickMember(kickedUserId, peerId);
    return res;
  }
  const error = new Error("UNAUTHORIZED");
}
