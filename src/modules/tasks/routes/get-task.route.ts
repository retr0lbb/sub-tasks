import type { FastifyInstance } from "fastify";
import { getTask } from "../handlers/get-task-handler";
import { prisma } from "../../../lib/prisma";
import { getTaskParamsSchema } from "../dtos/get-task.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function getTaskRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/project/:projectId/tasks/:taskId",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Tasks"],
				params: getTaskParamsSchema,
				summary: "Get a task and its subtasks",
				description: "Get a specific tasks with its subtasks",
			},
		},
		async (request, reply) => {
			const params = request.params;
			const user = request.user;

			try {
				const task = await getTask({ ...params, userId: user.id }, prisma);

				reply.status(200).send({
					data: task,
				});
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
