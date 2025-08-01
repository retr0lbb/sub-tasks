import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createProject } from "../handlers/create-project";
import { prisma } from "../../../lib/prisma";
import { ServerError } from "../../../errors/server.error";
import { requestUser } from "../../../utils/request-user.type";
import { parseSchema } from "../../../utils/parse-schema";
import { createProjectBodySchema } from "../dtos/create-project.dto";

export async function createProjectRoute(app: FastifyInstance) {
	app.post(
		"/project",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Project"],
				body: createProjectBodySchema,
				summary: "Creates a new project",
				description:
					"creates a new project connected with the user by passing jwt token",
			},
		},
		createProjectHandler,
	);
}

async function createProjectHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const body = parseSchema(createProjectBodySchema, request.body);
		const user = parseSchema(requestUser, request.user);

		const project = await createProject({ ...body, userId: user.id }, prisma);

		return reply
			.status(201)
			.send({ message: "project created with success", data: project });
	} catch (error) {
		throw new ServerError("Could'nt create project");
	}
}
