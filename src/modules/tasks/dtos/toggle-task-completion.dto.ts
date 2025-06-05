import z from "zod";

export const toggleTaskCompletionBodySchema = z.object({
	isCompleted: z.coerce.boolean({ message: "Only boolean types are accepted" }),
});

export const toggleTaskCompletionParamsSchema = z.object({
	projectId: z.string().uuid({ message: "Project Id should be a valid UUID" }),
	taskId: z.string().uuid({ message: "Task Id should be a valid UUID" }),
});

export type ToggleTaskCompletionBody = z.infer<
	typeof toggleTaskCompletionBodySchema
>;

export type ToggleTaskCompletionParams = z.infer<
	typeof toggleTaskCompletionParamsSchema
>;
