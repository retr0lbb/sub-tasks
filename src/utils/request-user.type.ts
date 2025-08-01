import z from "zod/v4";

export const requestUser = z.object({
	id: z.string().uuid(),
	iat: z.number(),
});

export type RequestUser = { userId: string };
