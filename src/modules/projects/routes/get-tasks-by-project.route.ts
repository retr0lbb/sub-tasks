import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getAllTasksByProject } from "../handlers/get-tasks-by-project";
import { prisma } from "../../../lib/prisma";
import {
	getTasksByProjectParamsSchema,
	getTasksByProjectQuerySchema,
} from "../dtos/get-tasks-by-project.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function getAllTasksRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/project/:projectId/tasks",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Tasks"],
				summary: "Get all project tasks",
				security: [{ bearerAuth: [] }],
				params: getTasksByProjectParamsSchema,
				querystring: getTasksByProjectQuerySchema,
			},
		},
		async (request, reply) => {
			const params = request.params;
			const user = request.user;
			const options = request.query;

			const task = await getAllTasksByProject(
				{ ...params, userId: user.id },
				options,
				prisma,
			);

			reply.status(200).send({
				data: task,
			});
		},
	);
}
