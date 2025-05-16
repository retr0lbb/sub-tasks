import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createProject } from "../handlers/projects/create-project";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ServerError } from "../errors/server.error";

export async function createProjectRoute(app: FastifyInstance) {
	app.post("/project", createProjectHandler);
}

const Body = z.object({
	name: z.string(),
	description: z.string(),
});
async function createProjectHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { description, name } = Body.parse(request.body);

	try {
		const project = await createProject(prisma, { description, name });

		return reply
			.status(201)
			.send({ message: "project created with success", data: project });
	} catch (error) {
		throw new ServerError("Could'nt create project");
	}
}
