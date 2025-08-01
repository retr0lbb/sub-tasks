import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getTask } from "../handlers/get-task-handler";
import { prisma } from "../../../lib/prisma";
import { requestUser } from "../../../utils/request-user.type";
import { getTaskParamsSchema } from "../dtos/get-task.dto";
import { InputError } from "../../../errors/input-error";
import { parseSchema } from "../../../utils/parse-schema";

export async function getTaskRoute(app: FastifyInstance) {
	app.get(
		"/project/:projectId/tasks/:taskId",
		{ onRequest: [app.authenticate], schema: { tags: ["Tasks"] } },
		getTaskHandler,
	);
}

async function getTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	try {
		const params = parseSchema(getTaskParamsSchema, request.params);
		const user = parseSchema(requestUser, request.user);

		const task = await getTask({ ...params, userId: user.id }, prisma);

		reply.status(200).send({
			data: task,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
}
