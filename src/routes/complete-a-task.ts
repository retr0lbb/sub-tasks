import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"
import { completeTask } from "../handlers/complete-task-handler";


export async function completeTaskRoute(app: FastifyInstance){
    app.post("/task/:taskId/complete", completeTaskRouteHandler)
}

const requestParams = z.object({
    taskId: z.string().uuid()
})

async function completeTaskRouteHandler(request: FastifyRequest, reply: FastifyReply){

    const {taskId} = requestParams.parse(request.params)
    completeTask({taskId})
    
    return reply.status(200).send({
        message: "Task created sucessfully task updated Sucessfully"
    })

}