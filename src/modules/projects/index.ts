import type { FastifyInstance } from "fastify";

import { createProjectRoute } from "./routes/create-project";
import { deleteProjectRoute } from "./routes/delete-project";
import { getAllTasksRoute } from "./routes/get-tasks-by-project";

export async function projectModule(app: FastifyInstance) {
	app.register(createProjectRoute);
	app.register(deleteProjectRoute);
	app.register(getAllTasksRoute);
}
