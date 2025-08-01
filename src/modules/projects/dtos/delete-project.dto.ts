import z from "zod/v4";

export const deleteProjectParams = z.object({
	projectId: z.string().uuid(),
});

export type DeleteProjectParams = z.infer<typeof deleteProjectParams>;
