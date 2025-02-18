import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {z} from "zod"
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

    if(parentId){
        const parentTask = await TaskModel.getTask(parentId)

        if(!parentTask){
            throw new Error("Cannot find parent task")
        }
    }

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