import { prisma } from "../lib/prisma"

interface CreateTaskParams{
    title: string,
    description?: string,
    parentId?: string | null
}

export async function createTask({title, description, parentId}: CreateTaskParams){
    try {
        if(parentId){
            const parentTask = await prisma.tasks.findUnique({
                where: {
                    id: parentId
                }
            })
            if(!parentTask){
                throw new Error("Parent task not found")
            }
        }
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
