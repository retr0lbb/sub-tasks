import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requestUser } from "../../../utils/request-user.type";
import { LogOutUser } from "../handlers/logout-user";
import { prisma } from "../../../lib/prisma";
import { parseSchema } from "../../../utils/parse-schema";

export async function LogOutUserRoute(app: FastifyInstance) {
	app.post(
		"/auth/logout",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Auth"],
			},
		},
		LogOutUserHandler,
	);
}

async function LogOutUserHandler(request: FastifyRequest, reply: FastifyReply) {
	const user = parseSchema(requestUser, request.user);

	try {
		await LogOutUser(user.id, prisma);
		reply
			.status(200)
			.send({ message: "Logged out of all accounts All accounts" });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
