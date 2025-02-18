import fastify from "fastify";
import { createTaskRoute } from "./routes/create-task-route";

const app = fastify()


app.register(createTaskRoute)

app.listen({
    port: 3333,
}).then(
    () => {
        console.log("Http server running")
    }
)