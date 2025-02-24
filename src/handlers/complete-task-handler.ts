import { prisma } from "../lib/prisma"

interface CompleteTaskParams{
    taskId: string
}

export async function completeTask({taskId}: CompleteTaskParams){
    const task = await prisma.tasks.findUnique({
        where: {
            id: taskId
        }
    })

    if(!task){
        throw new Error("Task not found")
    }

    async function completeSubtask(taskId: string){
        const subtasks = await prisma.tasks.findMany({
            where: {
                parentId: taskId
            }
        })

        await prisma.tasks.update({
            where: {
                id: taskId
            },
            data: {
                isCompleted: true,
                updatedAt: new Date()
            }
        })

        for (const subtask of subtasks){
            await completeSubtask(subtask.id)
        }
    }

    completeSubtask(taskId)
}