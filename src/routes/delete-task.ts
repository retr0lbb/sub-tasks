import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { deleteTask } from "../handlers/tasks/delete-task";
import { prisma } from "../lib/prisma";
import { ServerError } from "../errors/server.error";

export async function deleteTaskRoute(app: FastifyInstance) {
	app.delete("/tasks/:taskId", deleteTaskHandler);
}

async function deleteTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const requestParamsSchema = z.object({
		taskId: z.string().uuid("taskId must be provided"),
	});

	const { taskId } = requestParamsSchema.parse(request.params);

	await deleteTask(taskId, prisma);
	return reply.status(200);
}
