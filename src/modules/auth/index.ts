import type { FastifyInstance } from "fastify";
import { registerUserRoute } from "./routes/register-user";
import { loginUserRoute } from "./routes/login-user";

export async function userModule(app: FastifyInstance) {
	app.register(registerUserRoute);
	app.register(loginUserRoute);
}
