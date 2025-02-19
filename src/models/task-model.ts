import { prisma } from "../lib/prisma";
import {Prisma} from "@prisma/client"

interface createTaskDTO{
    title: string,
    description?: string,
    parentId?: string
}

export class TaskModel{

    static async createTask({title, description, parentId}: createTaskDTO){
        try {
            const result = await prisma.tasks.create({
                data: {
                    title,
                    description,
                    parentId               
                }
            })

            return result
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    static async getTask(id: string){
        try {
            const task = await prisma.tasks.findUnique({
                where: {
                    id
                }
            })

            if(!task){
                throw new Error("Task not found")
            }

            return task
        } catch (error) {
            throw error
        }
    }

    static async getAllTasks({where, orderBy}: {where?: Prisma.TasksWhereInput, orderBy: "asc"| "desc"}){
        const tasks = await prisma.tasks.findMany({
            where: where,
            orderBy: {
                createdAt: orderBy
            }
        })

        return tasks
    }
}