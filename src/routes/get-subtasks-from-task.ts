import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {string, z} from "zod"
import { TaskModel } from "../models/task-model";


export async function getSubtasksFromATask(app: FastifyInstance){
    app.get("/tasks", getSubtasksFromATaskHandler)
}

async function getSubtasksFromATaskHandler(request: FastifyRequest, reply: FastifyReply){
    
}