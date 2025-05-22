import fastify from "fastify";
import { createTaskRoute } from "./modules/tasks/routes/create-task-route";
import { getTaskRoute } from "./modules/tasks/routes/get-task";
import { getAllTasksRoute } from "./modules/projects/routes/get-tasks-by-project";
import { toggleTaskCompletionRoute } from "./modules/tasks/routes/complete-a-task";
import { errorHandler } from "./errors/error-handler";
import { createProjectRoute } from "./modules/projects/routes/create-project";
import { updateTaskRoute } from "./modules/tasks/routes/update-task";
import { deleteTaskRoute } from "./modules/tasks/routes/delete-task";
import jwtPlugin from "./lib/jwt-plugin";
import { deleteProjectRoute } from "./modules/projects/routes/delete-project";
import { userModule } from "./modules/auth";
import { taskModule } from "./modules/tasks";
import { projectModule } from "./modules/projects";

const app = fastify();
app.setErrorHandler(errorHandler);

app.register(jwtPlugin);

app.register(userModule);
app.register(taskModule);
app.register(projectModule);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("Http server running");
	});
