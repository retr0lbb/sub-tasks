import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { updateTask } from "../handlers/update-task";
import { requestUser } from "../../../utils/request-user.type";
import {
	updateTaskBodySchema,
	updateTaskParamsSchema,
} from "../dtos/update-task.dto";
import { parseSchema } from "../../../utils/parse-schema";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function updateTaskRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().put(
		"/project/:projectId/tasks/:taskId",
		{
			onRequest: [app.authenticate, app.csrfProtection],
			schema: {
				tags: ["Tasks"],
				summary: "Update a task",
				description:
					"Update all fields of a task and checks for loops in updates",
				body: updateTaskBodySchema,
				params: updateTaskParamsSchema,
			},
		},
		async (request, reply) => {
			const body = request.body;
			const params = request.params;
			const user = request.user;

			try {
				await updateTask({ ...body, ...params, userId: user.id }, prisma);
				return reply.status(200).send({
					message: "task updated successfully!",
				});
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
