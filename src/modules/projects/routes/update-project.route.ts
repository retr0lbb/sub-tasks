import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { requestUser } from "../../../utils/request-user.type";
import { updateProject } from "../handlers/update-project";
import { prisma } from "../../../lib/prisma";
import { parseSchema } from "../../../utils/parse-schema";
import {
	updateBodySchema,
	updateParamsSchema,
} from "../dtos/update-project.dto";

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
	const body = parseSchema(updateBodySchema, request.body);
	const params = parseSchema(updateParamsSchema, request.params);
	const user = parseSchema(requestUser, request.user);

	try {
		const data = await updateProject(
			{ ...body, ...params, userId: user.id },
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
