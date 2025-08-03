import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { requestUser } from "../../../utils/request-user.type";
import { deleteProject } from "../handlers/delete-project";
import { prisma } from "../../../lib/prisma";
import { ServerError } from "../../../errors/server.error";
import { parseSchema } from "../../../utils/parse-schema";
import { deleteProjectParams } from "../dtos/delete-project.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function deleteProjectRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().delete(
		"/project/:projectId",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Project"],
				security: [{ bearerAuth: [] }],
				params: deleteProjectParams,
				summary: "deletes existing project",
				description: "Delete a project in database",
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
