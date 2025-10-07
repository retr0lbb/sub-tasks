import type { FastifyInstance } from "fastify";
import { getUserInfo } from "./routes/get-user-info";

export async function userModule(app: FastifyInstance) {
	app.register(getUserInfo);
}
