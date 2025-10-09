import fastify from "fastify";
import { errorHandler } from "./errors/error-handler";
import jwtPlugin from "./plugins/jwt-plugin";
import { authModule } from "./modules/auth";
import { taskModule } from "./modules/tasks";
import { projectModule } from "./modules/projects";
import cookie from "@fastify/cookie";
import { env } from "./utils/env";
import { LoggerConfig } from "./config/logger-config";
import cors from "@fastify/cors";
import {
	validatorCompiler,
	serializerCompiler,
	createJsonSchemaTransform,
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { HealthCheckRoute } from "./modules/health-check.route";
import { userModule } from "./modules/user";
import fastifyCsrfProtection from "@fastify/csrf-protection";

const app = fastify({
	requestTimeout: 100000,
	logger: LoggerConfig,
}).withTypeProvider<ZodTypeProvider>();

app.setErrorHandler(errorHandler);

app.register(jwtPlugin);
app.register(fastifyCsrfProtection);
app.register(cookie, {
	secret: env.COOKIE_SECRET,
	prefix: env.COOKIE_PREFIX,
});
app.register(cors, {
	origin: env.FRONT_END_URL,
	credentials: true,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(swagger, {
	openapi: {
		info: {
			title: "SubTasks",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
		servers: [],
	},
	transform: createJsonSchemaTransform({
		skipList: [],
	}),
});
app.register(swaggerUi, {
	routePrefix: "/docs",
});

app.get("/csrf", async (request, reply) => {
	const token = reply.generateCsrf();
	return { token };
});

app.register(authModule);
app.register(taskModule);
app.register(projectModule);
app.register(HealthCheckRoute);
app.register(userModule);

export { app };
