import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { registerUser } from "../handlers/register-user";
import { prisma } from "../../../lib/prisma";
import { registerBodySchema, RegisterBody } from "../dtos/register.dto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function registerUserRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/register",
		{
			schema: {
				tags: ["Auth"],
				summary: "Creates a new user account",
				description: "creates a user index in the database",
				body: registerBodySchema,
			},
		},
		async (request, reply) => {
			const body = request.body;

			try {
				const createdUser = await registerUser({ ...body }, prisma);
				return reply
					.status(201)
					.send({ message: "user created with success", id: createdUser.id });
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
