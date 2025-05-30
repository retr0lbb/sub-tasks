import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { deleteTask } from "../handlers/delete-task";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";

export async function deleteTaskRoute(app: FastifyInstance) {
	app.delete(
		"/project/:projectId/tasks/:taskId",
		{ onRequest: [app.authenticate] },
		deleteTaskHandler,
	);
}

async function deleteTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const { id: userId } = requestUser.parse(request.user);
	const requestParamsSchema = z.object({
		taskId: z.string().uuid("taskId must be provided"),
		projectId: z.string().uuid("Project Id must be provided"),
	});

	const { taskId, projectId } = requestParamsSchema.parse(request.params);

	try {
		await deleteTask(
			{
				taskId,
				projectId,
				userId,
			},
			prisma,
		);

		return reply.status(200).send({ message: "task deleted successfully" });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
