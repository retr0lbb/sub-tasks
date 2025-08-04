import type { FastifyInstance } from "fastify";
import { createProject } from "../handlers/create-project";
import { prisma } from "../../../lib/prisma";
import { ServerError } from "../../../errors/server.error";
import {
	createProjectBodySchema,
	createProjectResponse,
} from "../dtos/create-project.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function createProjectRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/project",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Project"],
				summary: "Creates a new project",
				description:
					"creates a new project connected with the user by passing jwt token, requires Authorization Header Authorization: Bearer <token>",
				security: [{ bearerAuth: [] }],
				body: createProjectBodySchema,
				response: createProjectResponse,
			},
		},
		async (request, reply) => {
			try {
				const body = request.body;
				const user = request.user;

				const project = await createProject(
					{ description: body.description, name: body.name, userId: user.id },
					prisma,
				);

				return reply
					.status(201)
					.send({ message: "project created with success", data: project });
			} catch (error) {
				throw new ServerError("Could'nt create project");
			}
		},
	);
}
