import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getTask } from "../handlers/tasks/get-task-handler";

const getTaskParams = z.object({
	taskId: z.string(),
});

export async function getTaskRoute(app: FastifyInstance) {
	app.get("/task/:taskId", getTaskHandler);
}

async function getTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const { taskId } = getTaskParams.parse(request.params);

	const task = await getTask({ id: taskId });

	reply.status(200).send({
		data: task,
	});
}
