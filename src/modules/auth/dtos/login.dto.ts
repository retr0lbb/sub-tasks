import { z } from "zod/v4";

export const loginBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const loginResponse = {
	200: z.object({
		message: z.string(),
		csrfToken: z.string(),
	}),
};

export type LoginBody = z.infer<typeof loginBodySchema>;
