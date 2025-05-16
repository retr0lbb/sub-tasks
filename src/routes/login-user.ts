import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { loginUser } from "../handlers/users/login-user";
import { prisma } from "../lib/prisma";

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

	const loggedUser = await loginUser({ email, password }, prisma);

	const token = this.jwt.sign({ id: loggedUser.id });

	return reply.status(200).send({ message: "user logged with success", token });
}
