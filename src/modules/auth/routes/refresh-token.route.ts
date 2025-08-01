import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod/v4";
import { refreshToken } from "../handlers/refresh-token";
import { prisma } from "../../../lib/prisma";
import { parseSchema } from "../../../utils/parse-schema";

export async function refreshTokenRoute(app: FastifyInstance) {
	app.get(
		"/auth/refresh",
		{
			schema: {
				tags: ["Auth"],
				summary: "Refresh user's JWT token",
				description: "Revalidates users JWT token using HttpOnly token",
			},
		},
		refreshTokenHandler,
	);
}

async function refreshTokenHandler(
	this: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const cookieSchema = z.object({
		refreshToken: z.string().uuid(),
	});

	const cookie = parseSchema(cookieSchema, request.cookies);

	try {
		const { accessToken } = await refreshToken(
			cookie.refreshToken,
			this,
			prisma,
		);

		return reply.status(200).send({ accessToken });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
