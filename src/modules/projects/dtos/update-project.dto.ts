import z from "zod/v4";

export const updateBodySchema = z.object({
	name: z.string().optional(),
	description: z.string().nullable().optional(),
	userId: z.string().uuid().optional(),
});
export const updateParamsSchema = z.object({
	projectId: z.string().uuid(),
});

export const updateProjectResponse = {
	200: z.object({
		message: z.string(),
		data: z.object({
			description: z.string(),
			id: z.string(),
			name: z.string(),
			userId: z.uuid().nullable(),
		}),
	}),
};

export type UpdateBody = z.infer<typeof updateBodySchema>;
export type UpdateParams = z.infer<typeof updateParamsSchema>;
