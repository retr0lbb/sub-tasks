import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createTask } from "../handlers/create-task-handler";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";
import {
	createTaskParamsSchema,
	createTaskBodySchema,
} from "../dtos/create-task.dto";
import { InputError } from "../../../errors/input-error";
import { parseSchema } from "../../../utils/parse-schema";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function createTaskRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/project/:projectId/tasks",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Tasks"],
				summary: "creates a new task",
				description: "Creates a new task for a project",
				body: createTaskBodySchema,
				params: createTaskParamsSchema,
			},
		},
		createTaskHandler,
	);
}

async function createTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const params = parseSchema(createTaskParamsSchema, request.params);
		const user = parseSchema(requestUser, request.user);
		const body = parseSchema(createTaskBodySchema, request.body);

		const data = await createTask(
			{
				...body,
				...params,
				userId: user.id,
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
