import { takeCoverage } from "v8";
import { prisma } from "../lib/prisma";



export async function getTasksAndSubtasks() {
        interface TaskInterface {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            isCompleted: boolean;
            subTasks: TaskInterface[];
        }

        const numberPerPage = 10

        const allTasks = await prisma.tasks.findMany({
            include: { SubTasks: true }
        })

        const taskMap = new Map<string, TaskInterface>();


        allTasks.forEach(task => {
            taskMap.set(task.id, {
                id: task.id,
                isCompleted: task.isCompleted,
                title: task.title,
                description: task.description,
                createdAt: task.createdAt,
                subTasks: []
            })
        })

        allTasks.forEach(task => {
            if(task.parentId && taskMap.has(task.parentId)){
                taskMap.get(task.parentId)!.subTasks.push(taskMap.get(task.id)!)
            }
        })

        const topLevelTasks = Array.from(taskMap.values()).filter(task => !allTasks.some(t => t.id === task.id && t.parentId));
    
        const startIndex = (0) * numberPerPage;
        return topLevelTasks.slice(startIndex, startIndex + numberPerPage);
    }