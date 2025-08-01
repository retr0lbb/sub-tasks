import type { FastifyInstance } from "fastify";

import { createProjectRoute } from "./routes/create-project.route";
import { deleteProjectRoute } from "./routes/delete-project.route";
import { getAllTasksRoute } from "./routes/get-tasks-by-project.route";
import { updateProjectRoute } from "./routes/update-project.route";
import { listUserProjectsRoute } from "./routes/list-projects.route";

export async function projectModule(app: FastifyInstance) {
	app.register(createProjectRoute);
	app.register(deleteProjectRoute);
	app.register(getAllTasksRoute);
	app.register(updateProjectRoute);
	app.register(listUserProjectsRoute);
}
