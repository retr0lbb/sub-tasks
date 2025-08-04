import { z } from "zod/v4";

export const logoutResponse = {
	200: z.object({
		message: z.string(),
	}),
};
