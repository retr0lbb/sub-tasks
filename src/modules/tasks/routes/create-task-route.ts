import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createTask } from "../handlers/create-task-handler";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";
import {
	createTaskParamsSchema,
	createTaskBodySchema,
} from "../dtos/create-task.dto";
import { InputError } from "../../../errors/input-error";

export async function createTaskRoute(app: FastifyInstance) {
	app.post(
		"/project/:projectId/tasks",
		{ onRequest: [app.authenticate] },
		createTaskHandler,
	);
}

async function createTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const body = createTaskBodySchema.safeParse(request.body);
	const params = createTaskParamsSchema.safeParse(request.params);
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
		const data = await createTask(
			{
				...body.data,
				...params.data,
				userId: user.data.id,
			},
			prisma,
		);

		return reply.status(201).send({
			message: "Task created successfully",
			data: data,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
}
