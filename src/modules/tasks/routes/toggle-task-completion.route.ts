import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { toggleTaskCompletion } from "../handlers/complete-task-handler";
import { ServerError } from "../../../errors/server.error";
import { prisma } from "../../../lib/prisma";
import {
	toggleTaskCompletionBodySchema,
	toggleTaskCompletionParamsSchema,
} from "../dtos/toggle-task-completion.dto";
import { InputError } from "../../../errors/input-error";
import { requestUser } from "../../../utils/request-user.type";
import { parseSchema } from "../../../utils/parse-schema";

export async function toggleTaskCompletionRoute(app: FastifyInstance) {
	app.put(
		"/project/:projectId/tasks/:taskId/complete",
		{ onRequest: [app.authenticate] },
		toggleTaskCompletionRouteHandler,
	);
}

async function toggleTaskCompletionRouteHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const body = parseSchema(toggleTaskCompletionBodySchema, request.body);
		const params = parseSchema(
			toggleTaskCompletionParamsSchema,
			request.params,
		);
		const user = parseSchema(requestUser, request.user);

		toggleTaskCompletion(
			{
				...body,
				...params,
				userId: user.id,
			},
			prisma,
		);
		return reply.status(200).send({
			message: "task updated successfully!",
		});
	} catch (error) {
		throw new ServerError("An error occurred processing complete task!");
	}
}
