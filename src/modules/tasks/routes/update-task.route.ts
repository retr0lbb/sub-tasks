import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { updateTask } from "../handlers/update-task";
import { requestUser } from "../../../utils/request-user.type";
import {
	updateTaskBodySchema,
	updateTaskParamsSchema,
} from "../dtos/update-task.dto";
import { parseSchema } from "../../../utils/parse-schema";

export async function updateTaskRoute(app: FastifyInstance) {
	app.put(
		"/project/:projectId/tasks/:taskId",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Tasks"],
				summary: "Update a task",
				description:
					"Update all fields of a task and checks for loops in updates",
				body: updateTaskBodySchema,
				params: updateTaskParamsSchema,
			},
		},
		updateTaskHandler,
	);
}

async function updateTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const body = parseSchema(updateTaskBodySchema, request.body);
		const params = parseSchema(updateTaskParamsSchema, request.params);
		const user = parseSchema(requestUser, request.user);

		await updateTask({ ...body, ...params, userId: user.id }, prisma);
		return reply.status(200).send({
			message: "task updated successfully!",
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
}
