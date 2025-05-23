import type { FastifyInstance } from "fastify";

import { createProjectRoute } from "./routes/create-project";
import { deleteProjectRoute } from "./routes/delete-project";
import { getAllTasksRoute } from "./routes/get-tasks-by-project";
import { updateProjectRoute } from "./routes/update-project.route";

export async function projectModule(app: FastifyInstance) {
	app.register(createProjectRoute);
	app.register(deleteProjectRoute);
	app.register(getAllTasksRoute);
	app.register(updateProjectRoute);
}
