import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginUser } from "../handlers/login-user";
import { prisma } from "../../../lib/prisma";
import { loginBodySchema, loginResponse } from "../dtos/login.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function loginUserRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/login",
		{
			schema: {
				tags: ["Auth"],
				description: "Validade Login from an existing user",
				summary: "Login existing user",
				body: loginBodySchema,
				response: loginResponse,
			},
		},
		async (request, reply) => {
			const body = request.body;
			console.log("it passed here");

			try {
				const tokens = await loginUser(body, prisma, app);
				reply.setCookie("refreshToken", tokens.refreshToken, {
					path: "/",
					httpOnly: true,
					sameSite: "strict",
					secure: false,
					maxAge: 60 * 60 * 24 * 365,
				});

				return reply.status(200).send({
					message: "user logged with success",
					token: tokens.accessToken,
				});
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
