import { z } from "zod/v4";

export const loginBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const loginResponse = {
	200: z.object({
		message: z.string(),
		token: z.jwt(),
	}),
};

export type LoginBody = z.infer<typeof loginBodySchema>;
