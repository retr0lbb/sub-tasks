import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { updateTask } from "../handlers/update-task";
import { requestUser } from "../../../utils/request-user.type";

export async function updateTaskRoute(app: FastifyInstance) {
	app.put(
		"/project/:projectId/tasks/:taskId",
		{ onRequest: [app.authenticate] },
		updateTaskHandler,
	);
}

async function updateTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const requestBody = z.object({
		title: z.string().optional(),
		description: z.string().optional().nullable(),
		parentId: z.string().uuid().optional().nullable(),
		isCompleted: z.coerce.boolean(),
	});

	const requestParams = z.object({
		projectId: z.string().uuid(),
		taskId: z.string().uuid(),
	});

	const { taskId, projectId } = requestParams.parse(request.params);
	const data = requestBody.parse(request.body);
	const { id: userId } = requestUser.parse(request.user);

	try {
		await updateTask(
			{ taskId, projectId, userId },
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
		console.log(error);
		throw error;
	}
}
