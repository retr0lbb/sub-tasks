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
			onRequest: [app.authenticate, app.csrfProtection],
			schema: {
				tags: ["Tasks"],
				summary: "creates a new task",
				description: "Creates a new task for a project",
				body: createTaskBodySchema,
				params: createTaskParamsSchema,
			},
		},
		async (request, reply) => {
			const params = request.params;
			const body = request.body;
			const user = request.user;

			try {
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
		},
	);
}
