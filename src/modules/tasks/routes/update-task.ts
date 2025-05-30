import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ServerError } from "../../../errors/server.error";
import { prisma } from "../../../lib/prisma";
import { updateTask } from "../handlers/update-task";

export async function updateTaskRoute(app: FastifyInstance) {
	app.patch(
		"/tasks/:taskId",
		{ onRequest: [app.authenticate] },
		updateTaskHandler,
	);
}

const requestParams = z.object({
	taskId: z.string().uuid(),
});

const requestBody = z.object({
	title: z.string().optional(),
	description: z.string().optional().nullable(),
	parentId: z.string().uuid().optional().nullable(),
	isCompleted: z.coerce.boolean(),
});

async function updateTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const { taskId } = requestParams.parse(request.params);
	const data = requestBody.parse(request.body);
	try {
		updateTask(
			taskId,
			{
				description: data.description,
				isCompleted: data.isCompleted,
				parentId: data.parentId,
				title: data.title,
			},
			prisma,
		);
		return reply.status(200).send({
			message: "task updated successfully!",
		});
	} catch (error) {
		throw new ServerError("An error occurred processing complete task!");
	}
}
