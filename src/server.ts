import fastify from "fastify";
import { createTaskRoute } from "./routes/create-task-route";
import { getTaskRoute } from "./routes/get-task";
import { getAllTasksRoute } from "./routes/get-tasks-by-project";
import { toggleTaskCompletionRoute } from "./routes/complete-a-task";
import { errorHandler } from "./errors/error-handler";
import { createProjectRoute } from "./routes/create-project";
import { updateTaskRoute } from "./routes/updateTask";
import { deleteTaskRoute } from "./routes/delete-task";
import { registerUserRoute } from "./routes/register-user";
import { env } from "./utils/env";
import { loginUserRoute } from "./routes/login-user";

const app = fastify();
app.setErrorHandler(errorHandler);

app.register(require("@fastify/jwt"), {
	secret: env.JWT_TOKEN_SECRET,
});

app.register(createTaskRoute);
app.register(getAllTasksRoute);
app.register(toggleTaskCompletionRoute);
app.register(deleteTaskRoute);
app.register(getTaskRoute);
app.register(updateTaskRoute);
app.register(createProjectRoute);
app.register(registerUserRoute);
app.register(loginUserRoute);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("Http server running");
	});
