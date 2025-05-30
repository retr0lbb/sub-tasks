import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { prisma } from "../../../lib/prisma";

export async function LogOutUser(userId: string, db: PrismaClient) {
	const user = await db.users.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new ClientError("User not found");
	}

	const userSessions = await db.sessions.findMany({
		where: {
			userId: userId,
		},
	});

	if (userSessions.length <= 0) {
		throw new ClientError("Not a single session found");
	}

	const allSessionsIds = userSessions.map((session) => {
		return session.id;
	});

	await db.sessions.updateMany({
		data: {
			isValid: false,
		},
		where: {
			id: {
				in: allSessionsIds,
			},
		},
	});
}
