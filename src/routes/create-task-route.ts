import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"
import {createTask} from "../handlers/create-task-handler"
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

    const data = await createTask({title, description, parentId})

    return reply.status(201).send({
        message: "Task created sucessfully",
        data: data
    })
}