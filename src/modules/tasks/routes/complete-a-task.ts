import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { toggleTaskCompletion } from "../handlers/complete-task-handler";
import { ServerError } from "../../../errors/server.error";
import { prisma } from "../../../lib/prisma";

export async function toggleTaskCompletionRoute(app: FastifyInstance) {
	app.put("/tasks/:taskId/complete", toggleTaskCompletionRouteHandler);
}

const requestParams = z.object({
	taskId: z.string().uuid(),
});

const requestBody = z.object({
	isCompleted: z.coerce.boolean(),
});

async function toggleTaskCompletionRouteHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { taskId } = requestParams.parse(request.params);
	const { isCompleted } = requestBody.parse(request.body);
	try {
		toggleTaskCompletion({ taskId, isCompleted }, prisma);
		return reply.status(200).send({
			message: "task updated successfully!",
		});
	} catch (error) {
		throw new ServerError("An error occurred processing complete task!");
	}
}
