import z from "zod";

export const deleteProjectParams = z.object({
	projectId: z.string().uuid(),
});

export type DeleteProjectParams = z.infer<typeof deleteProjectParams>;
