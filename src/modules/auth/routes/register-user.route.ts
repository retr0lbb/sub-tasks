import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { registerUser } from "../handlers/register-user";
import { prisma } from "../../../lib/prisma";
import { registerBodySchema } from "../dtos/register.dto";
import { parseSchema } from "../../../utils/parse-schema";

export async function registerUserRoute(app: FastifyInstance) {
	app.post("/auth/register", registerUserHandler);
}

async function registerUserHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const body = parseSchema(registerBodySchema, request.body);

	try {
		const createdUser = await registerUser({ ...body }, prisma);
		return reply
			.status(201)
			.send({ message: "user created with success", id: createdUser.id });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
