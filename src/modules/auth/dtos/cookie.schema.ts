import { z } from "zod/v4";

export const cookieSchema = z.object({
	refreshToken: z.uuid(),
});
