import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { refreshToken } from "../handlers/refresh-token";
import { prisma } from "../../../lib/prisma";

export async function refreshTokenRoute(app: FastifyInstance) {
	app.get("/auth/refresh", refreshTokenHandler);
}

async function refreshTokenHandler(
	this: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const cookieSchema = z.object({
		refreshToken: z.string().uuid(),
	});
	const { refreshToken: refresh } = cookieSchema.parse(request.cookies);
	try {
		const { accessToken } = await refreshToken(refresh, this, prisma);
		return reply.status(200).send({ accessToken });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
