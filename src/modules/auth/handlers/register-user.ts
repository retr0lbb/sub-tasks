import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { genSalt, hash } from "bcrypt";
import { env } from "../../../utils/env";
import type { RegisterBody } from "../dtos/register.dto";

export async function registerUser(data: RegisterBody, db: PrismaClient) {
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
