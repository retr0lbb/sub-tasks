import z from "zod/v4";

export const registerBodySchema = z.object({
	userName: z.string(),
	password: z.string().min(6).max(64),
	email: z.string().email(),
});

export const registerResponse = {
	201: z.object({
		message: z.string(),
		createdUser: z.object({
			id: z.uuid(),
			email: z.email(),
			username: z.string(),
		}),
	}),
};
export type RegisterBody = z.infer<typeof registerBodySchema>;
