import fastify from "fastify";
import { createTaskRoute } from "./routes/create-task-route";
import { getTaskRoute } from "./routes/get-task";
import { getAllTasksRoute } from "./routes/get-tasks-by-project";
import { toggleTaskCompletionRoute } from "./routes/complete-a-task";
import { errorHandler } from "./errors/error-handler";
import { createProjectRoute } from "./routes/create-project";

const app = fastify();

app.setErrorHandler(errorHandler);

app.register(createTaskRoute);
//app.register(getTaskRoute);
app.register(getAllTasksRoute);
app.register(toggleTaskCompletionRoute);
app.register(createProjectRoute);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("Http server running");
	});
