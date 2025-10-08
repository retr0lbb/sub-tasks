import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requestUser } from "../../../utils/request-user.type";
import { updateProject } from "../handlers/update-project";
import { prisma } from "../../../lib/prisma";
import { parseSchema } from "../../../utils/parse-schema";
import {
	updateBodySchema,
	updateParamsSchema,
	updateProjectResponse,
} from "../dtos/update-project.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function updateProjectRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().put(
		"/project/:projectId",
		{
			onRequest: [app.authenticate, app.csrfProtection],
			schema: {
				tags: ["Project"],
				summary: "Updates an existing user project",
				description: "Updates an existing user project",
				body: updateBodySchema,
				params: updateParamsSchema,
				response: updateProjectResponse,
			},
		},
		async (request, reply) => {
			const body = parseSchema(updateBodySchema, request.body);
			const params = parseSchema(updateParamsSchema, request.params);
			const user = parseSchema(requestUser, request.user);

			try {
				const data = await updateProject(
					{ ...body, ...params, userId: user.id },
					prisma,
				);

				return reply
					.status(200)
					.send({ message: "Project updated Successfully", data });
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
