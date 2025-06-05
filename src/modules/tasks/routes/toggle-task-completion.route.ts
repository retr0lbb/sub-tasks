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
	const body = toggleTaskCompletionBodySchema.safeParse(request.body);
	const params = toggleTaskCompletionParamsSchema.safeParse(request.params);
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

		toggleTaskCompletion(
			{
				...body.data,
				...params.data,
				userId: user.data.id,
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
