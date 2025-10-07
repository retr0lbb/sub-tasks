import type { FastifyInstance } from "fastify";
import { ZodError } from "zod/v4";
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

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	if ((error as any).validation) {
		return reply.status(400).send({
			message: "invalid input value",
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			error: (error as any).validation,
		});
	}

	if (error instanceof AppError) {
		return reply.status(error.statusCode).send({
			error: error.type,
			message: error.message,
			details: error.details,
		});
	}

	// biome-ignore lint/suspicious/noExplicitAny: <no need>
	if ((error as any).code === "FST_CSRF_INVALID_TOKEN") {
		request.log.warn({ err: error }, "CSRF token validation failed");
		return reply.status(403).send({
			error: "Forbidden",
			message: "Invalid CSRF token",
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

	//worst case
	console.log(error);

	return reply.status(500).send({
		error: "Internal Server Error",
		message: "An unexpected error occurred",
	});
};
