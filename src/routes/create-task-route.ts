import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"
import { TaskModel } from "../models/task-model";

const createTaskBodySchema = z.object({
    title: z.string().min(3, "cannot recieve an title lesser than 3"),
    parentId: z.string().optional(),
    description: z.string().optional()
})

export async function createTaskRoute(app: FastifyInstance){
    app.post("/tasks", createTaskHandler)
}

async function createTaskHandler(request: FastifyRequest, reply: FastifyReply){
    const {title, description, parentId} = createTaskBodySchema.parse(request.body)

    const createdTask = await TaskModel.createTask({
        title,
        description,
        parentId
    })

    return reply.status(201).send({
        message: "Task created sucessfully",
        data: createdTask
    })

}