import { prisma } from "../lib/prisma"

interface getTaskParams {
    id: string
}

export async function getTask({id}: getTaskParams){
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