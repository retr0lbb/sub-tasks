import type { FastifyInstance } from "fastify";
import { registerUserRoute } from "./routes/register-user.route";
import { loginUserRoute } from "./routes/login-user.route";
import { refreshTokenRoute } from "./routes/refresh-token.route";
import { LogOutUserRoute } from "./routes/logout-user.route";

export async function userModule(app: FastifyInstance) {
	console.log("it reads here");
	app.register(registerUserRoute);
	app.register(loginUserRoute);
	app.register(refreshTokenRoute);
	app.register(LogOutUserRoute);
}
