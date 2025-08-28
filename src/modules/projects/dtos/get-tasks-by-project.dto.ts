import z from "zod/v4";

export const getTasksByProjectParamsSchema = z.object({
	projectId: z.string().uuid(),
});

const TaskSchema = z.object({
	id: z.string().uuid(),
	description: z.string().nullable(),
	title: z.string(),
	createdAt: z.date(),
	updatedAt: z.date().nullable(),
	isCompleted: z.boolean(),
	parentId: z.uuid().nullable(),
});

const taskWithSubtask = TaskSchema.extend({
	subTasks: z.array(TaskSchema),
});

export const getTasksByProjectQuerySchema = z.object({
	order: z.literal("desc").or(z.literal("asc")).optional().default("asc"),
	max_recursion_depth: z.coerce.number().min(0).max(10_000).optional(),
	page: z.coerce.number().positive().default(1).optional(),
	per_page: z.coerce.number().positive().default(10).optional(),
});

export type GetTasksByProjectQuery = z.infer<
	typeof getTasksByProjectQuerySchema
>;

export const getTasksByProjectResponse = {
	200: z.object({
		data: z.array(taskWithSubtask),
	}),
};

export type GetTasksByProjectParams = z.infer<
	typeof getTasksByProjectParamsSchema
>;
