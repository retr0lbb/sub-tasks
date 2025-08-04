import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requestUser } from "../../../utils/request-user.type";
import { LogOutUser } from "../handlers/logout-user";
import { prisma } from "../../../lib/prisma";
import { parseSchema } from "../../../utils/parse-schema";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { logoutResponse } from "../dtos/logout.dto";

export async function LogOutUserRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/logout",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["Auth"],
				summary: "Delete user's previous session.",
				description:
					"Disconnects User with his session and invalidates all refresh tokens in this section",
				response: logoutResponse,
			},
		},
		async (request, reply) => {
			const user = request.user;

			try {
				await LogOutUser(user.id, prisma);
				reply
					.status(200)
					.send({ message: "Logged out of all accounts All accounts" });
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
