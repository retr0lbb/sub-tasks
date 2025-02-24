import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {string, z} from "zod"
import { getTasksAndSubtasks } from "../handlers/get-tasks-and-subtasks";


export async function getAllTasksRoute(app: FastifyInstance){
    app.get("/tasks", getAllTasksHandler)
}

const getAllTasksQueryParamsSchema = z.object({
    uncompleted_only: z.coerce.boolean().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.coerce.number().optional(),
    max_depth: z.coerce.number().optional()
})

async function getAllTasksHandler(request: FastifyRequest, reply: FastifyReply){

    const options = getAllTasksQueryParamsSchema.parse(request.query)

    const task = await getTasksAndSubtasks()

    reply.status(200).send({
        data: task
    })
}