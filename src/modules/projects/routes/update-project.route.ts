import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { requestUser } from "../../../utils/request-user.type";
import { updateProject } from "../handlers/update-project";
import { prisma } from "../../../lib/prisma";

export async function updateProjectRoute(app: FastifyInstance) {
	app.put(
		"/project/:projectId",
		{ onRequest: [app.authenticate] },
		updateProjectHandler,
	);
}

async function updateProjectHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const bodySchema = z.object({
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		userId: z.string().uuid().optional(),
	});
	const paramsSchema = z.object({
		projectId: z.string().uuid(),
	});

	const { id: userId } = requestUser.parse(request.user);
	const bodyData = bodySchema.parse(request.body);
	const { projectId } = paramsSchema.parse(request.params);

	try {
		const data = await updateProject(
			{ ...bodyData },
			userId,
			projectId,
			prisma,
		);

		return reply
			.status(200)
			.send({ message: "Project updated Successfully", data });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
