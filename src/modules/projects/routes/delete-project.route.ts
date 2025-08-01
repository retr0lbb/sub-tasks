import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { requestUser } from "../../../utils/request-user.type";
import { deleteProject } from "../handlers/delete-project";
import { prisma } from "../../../lib/prisma";
import { ServerError } from "../../../errors/server.error";
import { parseSchema } from "../../../utils/parse-schema";
import { deleteProjectParams } from "../dtos/delete-project.dto";

export async function deleteProjectRoute(app: FastifyInstance) {
	app.delete(
		"/project/:projectId",
		{ onRequest: [app.authenticate], schema: { tags: ["Project"] } },
		deleteProjectHandler,
	);
}

async function deleteProjectHandler(
	this: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const user = parseSchema(requestUser, request.user);
	const params = parseSchema(deleteProjectParams, request.params);

	try {
		await deleteProject({ ...params, userId: user.id }, prisma);
		return reply.status(200);
	} catch (error) {
		throw new ServerError("An error occurred");
	}
}
