import type { FastifyInstance } from "fastify";
import { registerUserRoute } from "./routes/register-user.route";
import { loginUserRoute } from "./routes/login-user.route";
import { refreshTokenRoute } from "./routes/refresh-token.route";
import { LogOutUserRoute } from "./routes/logout-user.route";

export async function authModule(app: FastifyInstance) {
	app.register(registerUserRoute);
	app.register(loginUserRoute);
	app.register(refreshTokenRoute);
	app.register(LogOutUserRoute);
}
