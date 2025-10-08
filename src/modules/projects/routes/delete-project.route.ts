import type { FastifyInstance } from "fastify";
import { deleteProject } from "../handlers/delete-project";
import { prisma } from "../../../lib/prisma";
import { ServerError } from "../../../errors/server.error";
import { deleteProjectParams } from "../dtos/delete-project.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function deleteProjectRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/project/:projectId",
		{
			onRequest: [app.authenticate, app.csrfProtection],
			schema: {
				tags: ["Project"],
				security: [{ bearerAuth: [] }],
				summary: "deletes existing project",
				description: "Delete a project in database",
				params: deleteProjectParams,
			},
		},
		async (request, reply) => {
			const user = request.user;
			const params = request.params;

			try {
				await deleteProject({ ...params, userId: user.id }, prisma);
				return reply.status(200).send();
			} catch (error) {
				console.log(error);
				throw new ServerError("An error occurred");
			}
		},
	);
}
