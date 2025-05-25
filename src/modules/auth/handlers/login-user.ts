import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { compare } from "bcrypt";
import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";

interface UserData {
	email: string;
	password: string;
}
export async function loginUser(
	data: UserData,
	db: PrismaClient,
	app: FastifyInstance,
) {
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

	const YEAR_IN_SECONDS = 31_536_000;

	const expiresAt = new Date(Date.now() + YEAR_IN_SECONDS * 1000);

	const refreshToken = await db.sessions.create({
		data: {
			userId: user.id,
			refreshToken: randomUUID(),
			isValid: true,
			expiresAt: expiresAt,
		},
	});

	const accessToken = app.jwt.sign({ id: user.id }, { expiresIn: "10m" });
	return { accessToken: accessToken, refreshToken: refreshToken.refreshToken };
}
