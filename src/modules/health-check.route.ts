import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function HealthCheckRoute(app: FastifyInstance) {
	app.get("/health", async (_, reply) => {
		try {
			await prisma.$queryRaw`SELECT 1`;

			return reply.status(200).send({
				app: "up",
				db: "connected",
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
			});
		} catch (error) {
			return reply.status(500).send({
				app: "down",
				db: "disconnected",
				message: error,
			});
		}
	});
}
