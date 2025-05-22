import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { genSalt, hash } from "bcrypt";
import { env } from "../../../utils/env";

interface UserDataProps {
	userName: string;
	email: string;
	password: string;
}

export async function registerUser(data: UserDataProps, db: PrismaClient) {
	const user = await db.users.findUnique({
		where: {
			email: data.email,
		},
	});

	if (user !== null) {
		throw new ClientError("This user already Exists");
	}

	const salt = await genSalt(Number(env.HASH_SALT));
	const hashedPassword = await hash(data.password, salt);

	const createdUser = await db.users.create({
		data: {
			email: data.email,
			password: hashedPassword,
			username: data.userName,
		},
	});

	return createdUser;
}
