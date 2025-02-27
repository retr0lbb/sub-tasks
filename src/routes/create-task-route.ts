import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"
import {createTask} from "../handlers/create-task-handler"
import { ServerError } from "../errors/server.error";
const createTaskBodySchema = z.object({
    title: z.string().min(3, "cannot recieve an title lesser than 3"),
    parentId: z.string().nullish(),
    description: z.string().optional()
})

export async function createTaskRoute(app: FastifyInstance){
    app.post("/tasks", createTaskHandler)
}

async function createTaskHandler(request: FastifyRequest, reply: FastifyReply){
    const {title, description, parentId} = createTaskBodySchema.parse(request.body)
    try {
        const data = await createTask({title, description, parentId})

        return reply.status(201).send({
            message: "Task created sucessfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        throw new ServerError("An error occurred creating task")
    }
}