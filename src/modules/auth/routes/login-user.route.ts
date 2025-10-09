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
				reply.setCookie(
					`${env.COOKIE_PREFIX}:refresh_token`,
					tokens.refreshToken,
					{
						path: "/",
						httpOnly: true,
						sameSite: "lax",
						secure: false,
						maxAge: 60 * 60 * 24 * 365, // A Year
					},
				);

				reply.setCookie(
					`${env.COOKIE_PREFIX}:access_token`,
					tokens.accessToken,
					{
						path: "/",
						httpOnly: true,
						sameSite: "lax",
						secure: false,
						maxAge: 60 * 60 * 24, // A day
					},
				);

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
