import z from "zod"
export type LoginCredentials = {
    email: string,
    password: string
}

export const LoginCredentialsSchema = z.object({
    email: z.string(),
    password: z.string()
})

export type LoginUser = {
    user_id: string, 
    password: string
}

export const refreshTokenInputSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
})

export type refreshTokenInputType = {
    refreshToken: string
}

export type JWTPayload = {
    userId: string
}

export const registerInput = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
})