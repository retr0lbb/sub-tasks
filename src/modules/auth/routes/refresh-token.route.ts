import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { refreshToken } from "../handlers/refresh-token";
import { prisma } from "../../../lib/prisma";
import { parseSchema } from "../../../utils/parse-schema";
import { cookieSchema } from "../dtos/cookie.schema";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function refreshTokenRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/auth/refresh",
		{
			schema: {
				tags: ["Auth"],
				summary: "Refresh user's JWT token",
				description: "Revalidates users JWT token using HttpOnly token",
			},
		},
		async (request, reply) => {
			const cookie = parseSchema(cookieSchema, request.cookies);

			try {
				const { accessToken } = await refreshToken(
					cookie.refreshToken,
					app,
					prisma,
				);

				return reply.status(200).send({ accessToken });
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
