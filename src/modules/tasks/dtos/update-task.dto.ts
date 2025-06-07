import z from "zod";

export const updateTaskBodySchema = z.object({
	title: z.string().optional(),
	description: z.string().optional().nullable(),
	parentId: z.string().uuid().optional().nullable(),
	isCompleted: z.coerce.boolean(),
});

export const updateTaskParamsSchema = z.object({
	projectId: z.string().uuid(),
	taskId: z.string().uuid(),
});

export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type UpdateTaskParams = z.infer<typeof updateTaskParamsSchema>;
