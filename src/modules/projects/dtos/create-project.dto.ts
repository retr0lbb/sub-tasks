import z from "zod/v4";

export const createProjectBodySchema = z.object({
	name: z.string(),
	description: z.string(),
});

export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;

export const createProjectResponse = {
	201: z.object({
		message: z.string(),
		data: z.object({
			description: z.string(),
			name: z.string(),
			id: z.string(),
			userId: z.string().nullable(),
		}),
	}),
};
