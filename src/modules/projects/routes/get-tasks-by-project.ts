import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getAllTasksByProject } from "../handlers/get-tasks-by-project";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";
import { parseSchema } from "../../../utils/parse-schema";
import { getTasksByProjectParamsSchema } from "../dtos/get-tasks-by-project.dto";

export async function getAllTasksRoute(app: FastifyInstance) {
	app.get(
		"/project/:projectId/tasks",
		{ onRequest: [app.authenticate] },
		getAllTasksHandler,
	);
}

async function getAllTasksHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const params = parseSchema(getTasksByProjectParamsSchema, request.params);
	const user = parseSchema(requestUser, request.user);

	const task = await getAllTasksByProject(
		{ ...params, userId: user.id },
		prisma,
	);

	reply.status(200).send({
		data: task,
	});
}
