import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getAllTasksByProject } from "../handlers/get-tasks-by-project";
import { prisma } from "../../../lib/prisma";
import { getTasksByProjectParamsSchema } from "../dtos/get-tasks-by-project.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function getAllTasksRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/project/:projectId/tasks",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Tasks"],
				security: [{ bearerAuth: [] }],
				params: getTasksByProjectParamsSchema,
				summary: "Get all project tasks",
			},
		},
		async (request, reply) => {
			const params = request.params;
			const user = request.user;

			const task = await getAllTasksByProject(
				{ ...params, userId: user.id },
				prisma,
			);

			reply.status(200).send({
				data: task,
			});
		},
	);
}
