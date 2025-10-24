import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { refreshToken } from "../handlers/refresh-token";
import { prisma } from "../../../lib/prisma";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { refreshTokenResponse } from "../dtos/refresh-token.dto";
import { Unauthorized } from "../../../errors/unauthorized";
import { ServerError } from "../../../errors/server.error";
import { createCookie } from "../../../utils/create-cookie";

export async function refreshTokenRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/auth/refresh",
		{
			schema: {
				tags: ["Auth"],
				summary: "Refresh user's JWT token",
				description: "Revalidates users JWT token using HttpOnly token",
				response: refreshTokenResponse,
			},
		},
		async (request, reply) => {
			const refreshCookie = request.cookies["@hyperbolic_tasks:refresh_token"];

			if (!refreshCookie) {
				throw new Unauthorized("Refresh token not found");
			}

			try {
				const { accessToken } = await refreshToken(refreshCookie, app, prisma);

				if (!accessToken) {
					throw new ServerError(
						"Something went wrong while generating a new token",
					);
				}

				createCookie({
					reply,
					cookie: accessToken,
					cookieName: "access_token",
				}); // a day by default

				return reply
					.status(200)
					.send({ message: "Token refresh with success" });
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
