import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requestUser } from "../../../utils/request-user.type";
import { listUserProjects } from "../handlers/list-user-projects";
import { prisma } from "../../../lib/prisma";
import { parseSchema } from "../../../utils/parse-schema";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { ListProjectsResponse } from "../dtos/list-projects.dto";

export async function listUserProjectsRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/project",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Project"],
				security: [{ bearerAuth: [] }],
				summary: "List all user's projects",
				description: "List all user projects",
				response: null,
			},
		},
		async (request, reply) => {
			const user = parseSchema(requestUser, request.user);

			try {
				const projects = await listUserProjects(user.id, prisma);
				return reply.status(200).send({ data: projects });
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
