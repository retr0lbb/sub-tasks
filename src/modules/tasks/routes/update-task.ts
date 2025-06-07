import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { updateTask } from "../handlers/update-task";
import { requestUser } from "../../../utils/request-user.type";
import {
	updateTaskBodySchema,
	updateTaskParamsSchema,
} from "../dtos/update-task.dto";
import { InputError } from "../../../errors/input-error";

export async function updateTaskRoute(app: FastifyInstance) {
	app.put(
		"/project/:projectId/tasks/:taskId",
		{ onRequest: [app.authenticate] },
		updateTaskHandler,
	);
}

async function updateTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const body = updateTaskBodySchema.safeParse(request.body);
	const params = updateTaskParamsSchema.safeParse(request.params);
	const user = requestUser.safeParse(request.user);

	try {
		if (!body.success) {
			throw new InputError(body.error.errors);
		}
		if (!params.success) {
			throw new InputError(params.error.errors);
		}
		if (!user.success) {
			throw new InputError(user.error.errors);
		}

		await updateTask(
			{ ...body.data, ...params.data, userId: user.data.id },
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
