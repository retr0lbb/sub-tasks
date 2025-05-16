import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { toggleTaskCompletion } from "../handlers/tasks/complete-task-handler";
import { ServerError } from "../errors/server.error";
import { prisma } from "../lib/prisma";

export async function toggleTaskCompletionRoute(app: FastifyInstance) {
	app.put("/task/:taskId/complete", toggleTaskCompletionRouteHandler);
}

const requestParams = z.object({
	taskId: z.string().uuid(),
});

const requestBody = z.object({
	completion: z.coerce.boolean(),
});

async function toggleTaskCompletionRouteHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { taskId } = requestParams.parse(request.params);
	const { completion } = requestBody.parse(request.body);
	try {
		toggleTaskCompletion({ taskId, completion }, prisma);
		return reply.status(200).send({
			message: "Task created sucessfully task updated Sucessfully",
		});
	} catch (error) {
		throw new ServerError("An error occured processing complete task");
	}
}
