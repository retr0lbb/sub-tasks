import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { requestUser } from "../utils/request-user.type";
import { deleteProject } from "../handlers/projects/delete-project";
import { prisma } from "../lib/prisma";
import { ServerError } from "../errors/server.error";

export async function deleteProjectRoute(app: FastifyInstance) {
	app.delete(
		"/project/:projectId",
		{ onRequest: [app.authenticate] },
		deleteProjectHandler,
	);
}

async function deleteProjectHandler(
	this: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const requestParamsSchema = z.object({
		projectId: z.string().uuid(),
	});

	const { projectId } = requestParamsSchema.parse(request.params);
	const { id: userId } = requestUser.parse(request.user);

	try {
		await deleteProject({ projectId, userId }, prisma);
		return reply.status(200);
	} catch (error) {
		throw new ServerError("An error occurred");
	}
}
