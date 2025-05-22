import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { registerUser } from "../handlers/register-user";
import { prisma } from "../../../lib/prisma";

export async function registerUserRoute(app: FastifyInstance) {
	app.post("/auth/register", registerUserHandler);
}

async function registerUserHandler(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const registerUserSchema = z.object({
		userName: z.string(),
		password: z.string().min(6).max(64),
		email: z.string().email(),
	});

	const { email, password, userName } = registerUserSchema.parse(request.body);

	try {
		const createdUser = await registerUser(
			{ email, password, userName },
			prisma,
		);
		return reply
			.status(201)
			.send({ message: "user created with success", token: createdUser.id });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
