import z from "zod/v4";

export const refreshTokenResponse = {
	200: z.object({
		token: z.jwt(),
	}),
};
