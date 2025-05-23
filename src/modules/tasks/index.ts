import type { FastifyInstance } from "fastify";
import { toggleTaskCompletionRoute } from "./routes/complete-a-task";
import { createTaskRoute } from "./routes/create-task-route";
import { deleteTaskRoute } from "./routes/delete-task";
import { getTaskRoute } from "./routes/get-task";
import { updateTaskRoute } from "./routes/update-task";

export async function taskModule(app: FastifyInstance) {
	app.register(toggleTaskCompletionRoute);
	app.register(createTaskRoute);
	app.register(deleteTaskRoute);
	app.register(getTaskRoute);
	app.register(updateTaskRoute);
}
