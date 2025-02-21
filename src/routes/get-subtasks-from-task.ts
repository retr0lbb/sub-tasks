import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {string, z} from "zod"
import { TaskModel } from "../models/task-model";


export async function getSubtasksFromATask(app: FastifyInstance){
    app.get("/task/:taskId/sub", getSubtasksFromATaskHandler)
}

const paramsSchema = z.object({
    taskId: z.string().uuid()
})

async function getSubtasksFromATaskHandler(request: FastifyRequest, reply: FastifyReply){
    const {taskId} = paramsSchema.parse(request.params)

    const sub = await TaskModel.getSubtasksFromTask({taskId})

    if(!sub){
        return reply.status(404).send({message: "subtasksNotFound"})
    }

    return reply.status(200).send({
        subtasks: sub.subtasks
    })
}