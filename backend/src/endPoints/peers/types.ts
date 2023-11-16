import z from 'zod'

export const peerCreationSchema = z.object({
    userId: z.string(),
    peerName: z.string()
})

export const peer = z.object({
    peerId: z.string(),
    peerName: z.string(),
    userId: z.string()
})

export const kickUserSchema = z.object({
    peerId: z.string(),
    kickerId: z.string(),
    kickedUserId: z.string()
})