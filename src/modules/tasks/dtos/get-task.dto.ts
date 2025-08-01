import z from "zod/v4";

export const getTaskParamsSchema = z.object({
	projectId: z.string().uuid({ message: "Project Id should be a valid UUID" }),
	taskId: z.string().uuid({ message: "Task Id should be a valid UUID" }),
});

export type GetTasksParams = z.infer<typeof getTaskParamsSchema>;
