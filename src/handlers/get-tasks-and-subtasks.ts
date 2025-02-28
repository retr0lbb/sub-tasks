import { takeCoverage } from "v8";
import { prisma } from "../lib/prisma";
import { transferableAbortController } from "util";
import { ClientError } from "../errors/client-error";

export interface getTasksAndSubtasksOptions{
    uncompleted_only?: boolean | undefined;
    from?: string | undefined;
    to?: string | undefined;
    page?: number | undefined;
    max_depth?: number | undefined;
    numbersPerpage?: number
}

export interface TaskInterface {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    isCompleted: boolean;
    subTasks: TaskInterface[];
}

export async function getTasksAndSubtasks(options: getTasksAndSubtasksOptions) {
    const numberPerPage = options.numbersPerpage ?? 10
    const allTasks = await prisma.tasks.findMany({
        where: { isCompleted: options.uncompleted_only },
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
    const startIndex = (options.page? (options.page > 0? options.page-1: 0): 0) * numberPerPage;

    const tasks = topLevelTasks.slice(startIndex, startIndex + numberPerPage)

    if(topLevelTasks.length < numberPerPage * (options.page ?? 0)){
        throw new ClientError("Page incorrect")
    }

    return {tasks: tasks, numberOfEntries: topLevelTasks.length};
}