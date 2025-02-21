import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {string, z} from "zod"
import { TaskModel } from "../models/task-model";


export async function getAllTasksRoute(app: FastifyInstance){
    app.get("/tasks", getAllTasksHandler)
}

async function getAllTasksHandler(request: FastifyRequest, reply: FastifyReply){

    const task = await TaskModel.organizeTasksBySubtasks()

    reply.status(200).send({
        data: task
    })
}