import z from "zod";

export const getTasksByProjectParamsSchema = z.object({
	projectId: z.string().uuid(),
});

export type GetTasksByProjectParams = z.infer<
	typeof getTasksByProjectParamsSchema
>;
