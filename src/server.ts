import fastify from "fastify";
import { createTaskRoute } from "./routes/create-task-route";
import { getTaskRoute } from "./routes/get-task";
import { getAllTasksRoute } from "./routes/get-all-tasks";
import { getSubtasksFromATask } from "./routes/get-subtasks-from-task";
import { completeTaskRoute } from "./routes/complete-a-task";

const app = fastify()

app.register(createTaskRoute)
app.register(getTaskRoute)
app.register(getAllTasksRoute)
app.register(getSubtasksFromATask)
app.register(completeTaskRoute)

app.listen({
    port: 3333,
}).then(
    () => {
        console.log("Http server running")
    }
)