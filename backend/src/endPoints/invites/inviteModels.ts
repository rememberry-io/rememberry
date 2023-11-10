import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { client } from "../../db/db";
import * as schema from "../../db/schema";
const database = drizzle(client, { schema });

export async function createInvite(invite:schema.NewInvite){
    const res = database
        .insert(schema.invites)
        .values({
            text: invite.text,
            sender_id: invite.sender_id,
            receiver_id:invite.receiver_id,
            peer_id: invite.peer_id
        })
        .returning()
}

export async function getById(inviteId:string): Promise<schema.Invite>{
    const invite = await database
        .select()
        .from(schema.invites)
        .where(eq(schema.invites.invite_id, inviteId))
    return invite[0]
}

export async function acceptInvite(invite:schema.Invite){
    const res = await database 
        .transaction(async(tx) => {
            await tx.insert(schema.Users_Peers).values({
                user_id: invite.receiver_id,
                peer_id: invite.peer_id
            })
            await tx.delete(schema.invites).where(eq(schema.invites.invite_id, invite.invite_id!))
        })
    return res
}