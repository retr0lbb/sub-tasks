import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../utils/env";

export default fp(async (app) => {
	app.register(jwt, {
		secret: env.JWT_TOKEN_SECRET,
		sign: {
			expiresIn: "1d",
		},
	});

	app.decorate(
		"authenticate",
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch (err) {
				reply
					.status(401)
					.send({ error: "Unauthorized", message: "Invalid or expired Token" });
				console.log(err);
			}
		},
	);
});
