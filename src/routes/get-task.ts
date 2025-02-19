import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {string, z} from "zod"
import { TaskModel } from "../models/task-model";

const getTaskParams = z.object({
    id: z.string()
})

export async function getTaskRoute(app: FastifyInstance){
    app.get("/tasks/:id", getTaskHandler)
}

async function getTaskHandler(request: FastifyRequest, reply: FastifyReply){
    const {id} = getTaskParams.parse(request.params)

    const task = await TaskModel.getTask(id)

    reply.status(200).send({
        data: task
    })
}