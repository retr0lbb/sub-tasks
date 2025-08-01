import { z } from "zod/v4";

export const loginBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
