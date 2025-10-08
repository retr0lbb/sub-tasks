import z from "zod/v4";

export const refreshTokenResponse = {
	200: z.object({
		message: z.string(),
	}),
};
