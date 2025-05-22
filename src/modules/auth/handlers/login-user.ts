import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { compare } from "bcrypt";

interface UserData {
	email: string;
	password: string;
}
export async function loginUser(data: UserData, db: PrismaClient) {
	const user = await db.users.findUnique({
		where: {
			email: data.email,
		},
	});

	if (!user) {
		throw new ClientError("User not found in database.");
	}

	const matchPasswords = await compare(data.password, user.password);

	if (!matchPasswords) {
		throw new ClientError("Forbidden passwords don't match");
	}

	return user;
}
