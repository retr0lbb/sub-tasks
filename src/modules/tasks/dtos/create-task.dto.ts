import z from "zod/v4";

export const createTaskBodySchema = z.object({
	title: z
		.string()
		.min(3, { message: "Title should be minimum 3 chars length" }),
	parentId: z.string().uuid({ message: "ParentId must be an UUID" }).nullish(),
	description: z.string().nullish(),
});

export const createTaskParamsSchema = z.object({
	projectId: z
		.string()
		.uuid({ message: "Project Id should be a valid UUID" })
		.nonempty({ message: "Project Id cant be null" }),
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type CreateTaskParams = z.infer<typeof createTaskParamsSchema>;
