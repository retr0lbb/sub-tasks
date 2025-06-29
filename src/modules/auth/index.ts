import type { FastifyInstance } from "fastify";
import { registerUserRoute } from "./routes/register-user.route";
import { loginUserRoute } from "./routes/login-user";
import { refreshTokenRoute } from "./routes/refresh-token";
import { LogOutUserRoute } from "./routes/logout-user";

export async function userModule(app: FastifyInstance) {
	app.register(registerUserRoute);
	app.register(loginUserRoute);
	app.register(refreshTokenRoute);
	app.register(LogOutUserRoute);
}
