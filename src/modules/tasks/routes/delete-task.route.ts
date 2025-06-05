import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { deleteTask } from "../handlers/delete-task";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";
import { deleteTaskParamsSchema } from "../dtos/delete-task.dto";
import { InputError } from "../../../errors/input-error";

export async function deleteTaskRoute(app: FastifyInstance) {
	app.delete(
		"/project/:projectId/tasks/:taskId",
		{ onRequest: [app.authenticate] },
		deleteTaskHandler,
	);
}

async function deleteTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const user = requestUser.safeParse(request.user);
	const params = deleteTaskParamsSchema.safeParse(request.params);

	try {
		if (!params.success) {
			throw new InputError(params.error.errors);
		}
		if (!user.success) {
			throw new InputError(user.error.errors);
		}

		await deleteTask(
			{
				...params.data,
				userId: user.data.id,
			},
			prisma,
		);

		return reply.status(200).send({ message: "task deleted successfully" });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
