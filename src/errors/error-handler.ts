import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { ClientError } from "./client-error";
import { ServerError } from "./server.error";
import { InputError } from "./input-error";

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

	if (error instanceof InputError) {
		return reply
			.status(400)
			.send({ message: "validation Errors", errors: error.errors.flat() });
	}

	request.log.error(
		{
			err: {
				message: error.message,
				stack: error.stack,
				name: error.name,
			},
		},
		"Unhandled Error",
	);

	return reply
		.status(error.statusCode ?? 500)
		.send({ message: "An error occurred", error: error.message });
};
