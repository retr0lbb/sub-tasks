import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";

export async function listUserProjects(userId: string, db: PrismaClient) {
	const user = await db.users.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new ClientError("User not found");
	}

	const userProjects = await db.projects.findMany({
		where: {
			userId: userId,
		},
		select: {
			_count: true,
			name: true,
			description: true,
			id: true,
		},
	});

	return userProjects;
}
