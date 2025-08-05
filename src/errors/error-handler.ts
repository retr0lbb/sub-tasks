import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { ClientError } from "./client-error";
import { ServerError } from "./server.error";
import { InputError } from "./input-error";
import { NotFoundError } from "./not-found-error";
import { ForbiddenError } from "./forbidden-error";
import { AppError } from "./_App-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
	if (error instanceof ZodError) {
		console.log(error);
		return reply.status(400).send({
			message: "invalid input value",
			error: error.flatten().fieldErrors,
		});
	}

	if (error instanceof AppError) {
		return reply.status(error.statusCode).send({
			error: error.type,
			message: error.message,
			details: error.details,
		});
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

	return reply.status(500).send({
		error: "Internal Server Error",
		message: "An unexpected error occurred",
	});
};
