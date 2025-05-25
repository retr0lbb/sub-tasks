import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { loginUser } from "../handlers/login-user";
import { prisma } from "../../../lib/prisma";

export async function loginUserRoute(app: FastifyInstance) {
	app.post("/auth/login", loginUserHandler);
}

async function loginUserHandler(
	this: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const bodySchema = z.object({
		email: z.string().email(),
		password: z.string(),
	});

	const { email, password } = bodySchema.parse(request.body);

	try {
		const tokens = await loginUser({ email, password }, prisma, this);
		return reply.status(200).send({
			message: "user logged with success",
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
}
