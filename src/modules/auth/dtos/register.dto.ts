import z from "zod";

export const registerBodySchema = z.object({
	userName: z.string(),
	password: z.string().min(6).max(64),
	email: z.string().email(),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
