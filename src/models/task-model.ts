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

    static async organizeTasksBySubtasks() {
        interface TaskInterface {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            isCompleted: boolean;
            subTasks: TaskInterface[];
        }
    
        const topLevelTasks = await prisma.tasks.findMany({
            where: { parentId: null },
            include: { SubTasks: true }
        });
    
        // Função recursiva para formatar as tarefas corretamente
        async function formatTask(task: Omit<TaskInterface, "subTasks"> & { SubTasks: any[] }): Promise<TaskInterface> {
            const subTasks = await prisma.tasks.findMany({
                where: { parentId: task.id },
                include: { SubTasks: true }
            });
    
            return {
                id: task.id,
                title: task.title,
                description: task.description,
                createdAt: task.createdAt,
                isCompleted: task.isCompleted,
                subTasks: await Promise.all(
                    subTasks.map(sub =>
                        formatTask({
                            id: sub.id,
                            title: sub.title,
                            description: sub.description,
                            createdAt: sub.createdAt,
                            isCompleted: sub.isCompleted,
                            SubTasks: sub.SubTasks
                        })
                    )
                )
            };
        }
    
        return Promise.all(topLevelTasks.map(formatTask));
    }

    static async getSubtasksFromTask({taskId}: {taskId:string}){
        const task = await prisma.tasks.findUnique({
            where: {
                id: taskId
            },
            include: {
                SubTasks: true
            }
        })

        if(!task){
            throw new Error("cannot find task")
        }

        if(task.SubTasks.length <= 0){
            return null
        }

        return { subtasks: task.SubTasks }
    }
}