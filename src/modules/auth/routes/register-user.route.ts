import type { FastifyInstance } from "fastify";
import { registerUser } from "../handlers/register-user";
import { prisma } from "../../../lib/prisma";
import { registerBodySchema, registerResponse } from "../dtos/register.dto";
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
				response: registerResponse,
			},
		},
		async (request, reply) => {
			const body = request.body;

			try {
				const createdUser = await registerUser({ ...body }, prisma);
				return reply
					.status(201)
					.send({ message: "User created!", createdUser });
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	);
}
