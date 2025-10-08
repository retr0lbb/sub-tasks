import type { FastifyInstance } from "fastify";
import { toggleTaskCompletion } from "../handlers/complete-task-handler";
import { ServerError } from "../../../errors/server.error";
import { prisma } from "../../../lib/prisma";
import {
	toggleTaskCompletionBodySchema,
	toggleTaskCompletionParamsSchema,
} from "../dtos/toggle-task-completion.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function toggleTaskCompletionRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().put(
		"/project/:projectId/tasks/:taskId/complete",
		{
			onRequest: [app.authenticate, app.csrfProtection],
			schema: {
				tags: ["Tasks"],
				summary: "mark as completed or uncompleted task and its subtasks",
				description: "Mark as complete or uncompleted task and its subtasks",
				body: toggleTaskCompletionBodySchema,
				params: toggleTaskCompletionParamsSchema,
			},
		},
		async (request, reply) => {
			const body = request.body;
			const params = request.params;
			const user = request.user;

			try {
				toggleTaskCompletion(
					{
						...body,
						...params,
						userId: user.id,
					},
					prisma,
				);
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
