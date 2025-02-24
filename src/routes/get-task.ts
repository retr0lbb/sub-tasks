import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {string, z} from "zod"
import { getTask } from "../handlers/get-task-handler";

const getTaskParams = z.object({
    taskId: z.string()
})

export async function getTaskRoute(app: FastifyInstance){
    app.get("/tasks/:taskId", getTaskHandler)
}

async function getTaskHandler(request: FastifyRequest, reply: FastifyReply){
    const { taskId } = getTaskParams.parse(request.params)

    const task = await getTask({id: taskId})

    reply.status(200).send({
        data: task
    })
}