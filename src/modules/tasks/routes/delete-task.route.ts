import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { deleteTask } from "../handlers/delete-task";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";
import { deleteTaskParamsSchema } from "../dtos/delete-task.dto";
import { parseSchema } from "../../../utils/parse-schema";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function deleteTaskRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/project/:projectId/tasks/:taskId",
		{
			onRequest: [app.authenticate, app.csrfProtection],
			schema: {
				tags: ["Tasks"],
				params: deleteTaskParamsSchema,
				summary: "deletes an existing project",
				description: "Deletes an existing project",
			},
		},
		async (request, reply) => {
			const params = request.params;
			const user = request.user;

			try {
				await deleteTask(
					{
						...params,
						userId: user.id,
					},
					prisma,
				);

				return reply.status(200).send({ message: "task deleted successfully" });
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
