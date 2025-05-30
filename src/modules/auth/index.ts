import type { FastifyInstance } from "fastify";
import { registerUserRoute } from "./routes/register-user";
import { loginUserRoute } from "./routes/login-user";
import { refreshTokenRoute } from "./routes/refresh-token";

export async function userModule(app: FastifyInstance) {
	app.register(registerUserRoute);
	app.register(loginUserRoute);
	app.register(refreshTokenRoute);
}
