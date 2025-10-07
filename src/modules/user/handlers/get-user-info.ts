import type { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../../../errors/not-found-error";

export async function getUserData(userId: string, db: PrismaClient) {
	const foundUser = await db.users.findUnique({
		where: {
			id: userId,
		},
		omit: {
			password: true,
			id: true,
		},
	});

	if (!foundUser) {
		throw new NotFoundError("User not found");
	}

	return foundUser;
}
