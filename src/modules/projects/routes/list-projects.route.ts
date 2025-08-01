import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requestUser } from "../../../utils/request-user.type";
import { listUserProjects } from "../handlers/list-user-projects";
import { prisma } from "../../../lib/prisma";
import { parseSchema } from "../../../utils/parse-schema";

export async function listUserProjectsRoute(app: FastifyInstance) {
	app.get(
		"/project",
		{ onRequest: [app.authenticate], schema: { tags: ["Project"] } },
		listUserProjectsHandler,
	);
}

async function listUserProjectsHandler(
	this: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const user = parseSchema(requestUser, request.user);

	try {
		const projects = await listUserProjects(user.id, prisma);
		return reply.status(200).send({ data: projects });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
