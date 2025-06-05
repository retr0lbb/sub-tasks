import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getAllTasksByProject } from "../handlers/get-tasks-by-project";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";

export async function getAllTasksRoute(app: FastifyInstance) {
	app.get(
		"/project/:projectId/tasks",
		{ onRequest: [app.authenticate] },
		getAllTasksHandler,
	);
}

const params = z.object({
	projectId: z.string().uuid(),
});

async function getAllTasksHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { projectId } = params.parse(request.params);
	const { id: userId } = requestUser.parse(request.user);

	const task = await getAllTasksByProject(prisma, { projectId, userId });

	reply.status(200).send({
		data: task,
	});
}
