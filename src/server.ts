import fastify from "fastify";
import { errorHandler } from "./errors/error-handler";
import jwtPlugin from "./lib/jwt-plugin";
import { userModule } from "./modules/auth";
import { taskModule } from "./modules/tasks";
import { projectModule } from "./modules/projects";
import cookie from "@fastify/cookie";
import { env } from "./utils/env";
import { LoggerConfig } from "./config/logger-config";
import cors from "@fastify/cors";
import {
	validatorCompiler,
	serializerCompiler,
	jsonSchemaTransform,
	createJsonSchemaTransform,
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import z from "zod/v4";

const app = fastify({
	requestTimeout: 100000,
	logger: LoggerConfig,
}).withTypeProvider<ZodTypeProvider>();

app.setErrorHandler(errorHandler);

app.register(jwtPlugin);
app.register(cookie, {
	secret: env.COOKIE_SECRET,
	prefix: env.COOKIE_PREFIX,
});
app.register(cors, {
	origin: env.FRONT_END_URL,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(swagger, {
	openapi: {
		info: {
			title: "SubTasks",
			version: "1.0.0",
		},
		servers: [],
	},
	transform: createJsonSchemaTransform({
		skipList: [],
	}),
});
app.register(swaggerUi, {
	routePrefix: "/docs",
});

app.register(userModule);
app.register(taskModule);
app.register(projectModule);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		app.log.info("Server started on http://localhost:3333");
		console.log("server Running");
	});
