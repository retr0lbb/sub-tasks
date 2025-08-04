import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createProject } from "../handlers/create-project";
import { prisma } from "../../../lib/prisma";
import { ServerError } from "../../../errors/server.error";
import { requestUser } from "../../../utils/request-user.type";
import { parseSchema } from "../../../utils/parse-schema";
import { createProjectBodySchema } from "../dtos/create-project.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function createProjectRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/project",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Project"],
				security: [{ bearerAuth: [] }],
				body: createProjectBodySchema,
				summary: "Creates a new project",
				description:
					"creates a new project connected with the user by passing jwt token, requires Authorization Header Authorization: Bearer <token>",
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
