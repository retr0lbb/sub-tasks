import { prisma } from "../lib/prisma";

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
}