import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { deleteTask } from "../handlers/delete-task";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";
import { deleteTaskParamsSchema } from "../dtos/delete-task.dto";
import { InputError } from "../../../errors/input-error";
import { parseSchema } from "../../../utils/parse-schema";

export async function deleteTaskRoute(app: FastifyInstance) {
	app.delete(
		"/project/:projectId/tasks/:taskId",
		{ onRequest: [app.authenticate] },
		deleteTaskHandler,
	);
}

async function deleteTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const params = parseSchema(deleteTaskParamsSchema, request.body);
		const user = parseSchema(requestUser, request.user);

		await deleteTask(
			{
				...params,
				userId: user.id,
			},
			prisma,
		);

		return reply.status(200).send({ message: "task deleted successfully" });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
