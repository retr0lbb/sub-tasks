import z from "zod/v4";

export const updateTaskBodySchema = z.object({
	title: z.string().optional(),
	description: z.string().nullish(),
	parentId: z
		.string()
		.uuid({ message: "Parent Id should be a valid UUID" })
		.nullish(),
	isCompleted: z.coerce.boolean(),
});

export const updateTaskParamsSchema = z.object({
	projectId: z.string().uuid(),
	taskId: z.string().uuid(),
});

export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type UpdateTaskParams = z.infer<typeof updateTaskParamsSchema>;
