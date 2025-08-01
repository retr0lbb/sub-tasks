import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginUser } from "../handlers/login-user";
import { prisma } from "../../../lib/prisma";
import { parseSchema } from "../../../utils/parse-schema";
import { loginBodySchema } from "../dtos/login.dto";
import { z } from "zod/v4";

export async function loginUserRoute(app: FastifyInstance) {
	app.post(
		"/auth/login",
		{
			schema: {
				tags: ["Auth"],
				description: "Validade Login from an existing user",
				body: loginBodySchema,
				response: {
					200: z.object({ message: z.string(), accessToken: z.string() }),
				},
			},
		},
		loginUserHandler,
	);
}

async function loginUserHandler(
	this: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const body = parseSchema(loginBodySchema, request.body);

	try {
		const tokens = await loginUser(body, prisma, this);
		reply.setCookie("refreshToken", tokens.refreshToken, {
			path: "/",
			httpOnly: true,
			sameSite: "strict",
			secure: false,
			maxAge: 60 * 60 * 24 * 365,
		});

		return reply.status(200).send({
			message: "user logged with success",
			accessToken: tokens.accessToken,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
}
