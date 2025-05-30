import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import type { FastifyInstance } from "fastify";

export async function refreshToken(
	token: string,
	app: FastifyInstance,
	db: PrismaClient,
) {
	const userSession = await db.sessions.findUnique({
		where: {
			refreshToken: token,
		},
	});

	if (!userSession) {
		throw new ClientError("Session not found Please login in if you must");
	}

	if (userSession.isValid === false) {
		throw new ClientError("Session expired please log in again");
	}

	const validUser = await db.users.findUnique({
		where: {
			id: userSession.userId,
		},
	});

	if (!validUser) {
		throw new ClientError("User not found");
	}

	const accessToken = app.jwt.sign(
		{ id: userSession.userId },
		{ expiresIn: "10m" },
	);

	return { accessToken };
}
