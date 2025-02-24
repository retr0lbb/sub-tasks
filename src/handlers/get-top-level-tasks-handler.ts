import { prisma } from "../lib/prisma"

export async function getAllTopLevelTaks(){
    try {

        const tasks = await prisma.tasks.findMany({
            where: {
                parentId: null
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        return tasks
        
    } catch (error) {
        console.log(error)
        throw error
    }
}