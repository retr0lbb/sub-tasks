import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { ClientError } from "./client-error";
import { ServerError } from "./server.error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
	if (error instanceof ZodError) {
		console.log(error);
		return reply.status(400).send({
			message: "invalid input value",
			error: error.flatten().fieldErrors,
		});
	}

	if (error instanceof ClientError) {
		return reply.status(400).send({ message: error.message });
	}

	if (error instanceof ServerError) {
		return reply.status(500).send({ message: error.message });
	}

	console.log(error);
};
