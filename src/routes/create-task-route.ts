import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createTask } from "../handlers/tasks/create-task-handler";
import { ServerError } from "../errors/server.error";
import { prisma } from "../lib/prisma";
import { requestUser } from "../utils/request-user.type";

const createTaskBodySchema = z.object({
	title: z.string().min(3, "cannot receive an title lesser than 3"),
	parentId: z.string().nullish(),
	description: z.string().optional(),
});
const Params = z.object({
	projectId: z.string().uuid(),
});

export async function createTaskRoute(app: FastifyInstance) {
	app.post(
		"/project/:projectId/tasks",
		{ onRequest: [app.authenticate] },
		createTaskHandler,
	);
}

async function createTaskHandler(request: FastifyRequest, reply: FastifyReply) {
	const { title, description, parentId } = createTaskBodySchema.parse(
		request.body,
	);
	const { projectId } = Params.parse(request.params);
	const { id: userId } = requestUser.parse(request.user);

	try {
		const data = await createTask(prisma, {
			title,
			description,
			parentId,
			projectId,
			userId,
		});

		return reply.status(201).send({
			message: "Task created successfully",
			data: data,
		});
	} catch (error) {
		console.log(error);
		throw new ServerError("An error occurred creating task");
	}
}
