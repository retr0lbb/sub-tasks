import z from "zod/v4";

export const updateBodySchema = z.object({
	name: z.string().optional(),
	description: z.string().nullable().optional(),
	userId: z.string().uuid().optional(),
});
export const updateParamsSchema = z.object({
	projectId: z.string().uuid(),
});

export type UpdateBody = z.infer<typeof updateBodySchema>;
export type UpdateParams = z.infer<typeof updateParamsSchema>;
