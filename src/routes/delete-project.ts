import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function deleteProjectRoute(app: FastifyInstance) {
	app.delete(
		"/project/:projectId",
		{ onRequest: [app.authenticate] },
		deleteProjectHandler,
	);
}

async function deleteProjectHandler(
	this: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const requestParamsSchema = z.object({
		projectId: z.string().uuid(),
	});

	const { projectId } = requestParamsSchema.parse(request.params);
}
