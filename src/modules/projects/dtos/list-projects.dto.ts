import { z } from "zod/v4";

export const ListProjectsResponse = {
	200: z.object({
		data: z.array(
			z.object({
				description: z.string(),
				id: z.uuid(),
				_count: z.object({
					Users: z.number().positive(),
					tasks: z.number().positive(),
				}),
				name: z.string(),
			}),
		),
	}),
};
