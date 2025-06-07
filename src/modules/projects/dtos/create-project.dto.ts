import z from "zod";

export const createProjectBodySchema = z.object({
	name: z.string(),
	description: z.string(),
});

export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
