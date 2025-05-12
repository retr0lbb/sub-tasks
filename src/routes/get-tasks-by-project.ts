import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getAllTasksByProject } from "../handlers/get-tasks-by-project";
import { prisma } from "../lib/prisma";

export async function getAllTasksRoute(app: FastifyInstance) {
	app.get("/project/:projectId/tasks", getAllTasksHandler);
}

const params = z.object({
	projectId: z.string().uuid(),
});

async function getAllTasksHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { projectId } = params.parse(request.params);

	const task = await getAllTasksByProject(prisma, { projectId });

	reply.status(200).send({
		data: task,
	});
}
