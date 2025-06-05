import z from "zod";

export const deleteTaskParamsSchema = z.object({
	projectId: z.string().uuid({ message: "Project Id should be a valid UUID" }),
	taskId: z.string().uuid({ message: "Task Id should be a valid UUID" }),
});

export type DeleteTaskParams = z.infer<typeof deleteTaskParamsSchema>;
