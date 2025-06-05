import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getTask } from "../handlers/get-task-handler";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";
import { getTaskParamsSchema } from "../dtos/get-task.dto";
import { InputError } from "../../../errors/input-error";

export async function getTaskRoute(app: FastifyInstance) {
	app.get(
		"/project/:projectId/tasks/:taskId",
		{ onRequest: [app.authenticate] },
		getTaskHandler,
	);
}

async function getTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const user = requestUser.safeParse(request.user);
	const params = getTaskParamsSchema.safeParse(request.params);

	try {
		if (!user.success) {
			throw new InputError(user.error.errors);
		}

		if (!params.success) {
			throw new InputError(params.error.errors);
		}

		const task = await getTask(
			{ ...params.data, userId: user.data.id },
			prisma,
		);
		reply.status(200).send({
			data: task,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
}
