import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"
import { toggleTaskCompletion } from "../handlers/complete-task-handler";
import { ServerError } from "../errors/server.error";


export async function toggleTaskCompletionRoute(app: FastifyInstance){
    app.post("/task/:taskId/complete", toggleTaskCompletionRouteHandler)
}

const requestParams = z.object({
    taskId: z.string().uuid()
})

const requestBody = z.object({
    completion: z.coerce.boolean()
})

async function toggleTaskCompletionRouteHandler(request: FastifyRequest, reply: FastifyReply){

    const {taskId} = requestParams.parse(request.params)
    const {completion} = requestBody.parse(request.body)
    try {
        toggleTaskCompletion({taskId, completion})
        return reply.status(200).send({
            message: "Task created sucessfully task updated Sucessfully"
        })
    } catch (error) {
        throw new ServerError("An error occured processing complete task")
    }
}