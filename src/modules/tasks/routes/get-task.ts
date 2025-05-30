import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getTask } from "../handlers/get-task-handler";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";

export async function getTaskRoute(app: FastifyInstance) {
	app.get(
		"/project/:projectId/tasks/:taskId",
		{ onRequest: [app.authenticate] },
		getTaskHandler,
	);
}

async function getTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const getTaskParams = z.object({
		projectId: z.string().uuid(),
		taskId: z.string().uuid(),
	});

	const { id: userId } = requestUser.parse(request.user);
	const { projectId, taskId } = getTaskParams.parse(request.params);

	const task = await getTask({ taskId, projectId, userId }, prisma);

	reply.status(200).send({
		data: task,
	});
}
