import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { getUserData } from "../handlers/get-user-info";
import { prisma } from "../../../lib/prisma";

const getUserInfoSchema = z.object({
	email: z.email(),
	username: z.string().nonempty(),
});

export async function getUserInfo(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/user/info",
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ["User"],
				summary: "Get users data by passing the logged token",
				description:
					"Gets users name, email and id by taking the token on the request",
				response: {
					200: getUserInfoSchema,
				},
			},
		},
		async (request, reply) => {
			const user = request.user;

			try {
				const userData = await getUserData(user.id, prisma);
				reply.status(200).send({ ...userData });
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
