import {
	FastifyError,
	type FastifyInstance,
	type FastifyReply,
	type FastifyRequest,
} from "fastify";
import { loginUser } from "../handlers/login-user";
import { prisma } from "../../../lib/prisma";
import { loginBodySchema, loginResponse } from "../dtos/login.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "../../../utils/env";
import { createCookie } from "../../../utils/create-cookie";
import { refreshToken } from "../handlers/refresh-token";

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

			try {
				const tokens = await loginUser(body, prisma, app);

				createCookie({
					reply: reply,
					cookie: tokens.refreshToken,
					cookieName: "refresh_token",
					ExpirationInSeconds: 60 * 60 * 24 * 365, //a year bro
				});

				createCookie({
					reply,
					cookie: tokens.accessToken,
					cookieName: "access_token",
				}); // a day for default

				const csrfToken = reply.generateCsrf();

				return reply.status(200).send({
					message: "user logged with success",
					csrfToken: csrfToken,
				});
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
