import { describe, it, expect, Mock, vi, should, beforeEach} from "vitest";
import { toggleTaskCompletion } from "./complete-task-handler"
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";


vi.mock("../lib/prisma", () => ({
    prisma: {
      tasks: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn()
      },
    },
  }));


describe("it should complete tasks", async () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    it("should update one task sucessfully to true", async() => {
        vi.mocked(prisma.tasks.findUnique).mockResolvedValue({
            id: 'major-task',
            description: "random",
            isCompleted: false,
            parentId: null,
            createdAt: new Date(),
            title: "random",
            updatedAt: null
        })

        vi.mocked(prisma.tasks.findMany).mockResolvedValue([])

        await toggleTaskCompletion({taskId: "major-task", completion: true})
        
        expect(prisma.tasks.findMany).toHaveBeenCalledTimes(1)
        expect(await prisma.tasks.findMany()).toEqual([])

    })

    it("should return erro if cannot find parent task", async() => {

        vi.mocked(prisma.tasks.findUnique).mockResolvedValue(null)

        await expect(toggleTaskCompletion({taskId: "major-task", completion: false})).rejects.toBeInstanceOf(ClientError)
    }) 

    it("should return error if complete and isCompleted are equal", async() => {
        vi.mocked(prisma.tasks.findUnique).mockResolvedValue({
            id: 'major-task',
            description: "random",
            isCompleted: true,
            parentId: null,
            createdAt: new Date(),
            title: "random",
            updatedAt: null
        })

        await expect(toggleTaskCompletion({taskId: "major-task", completion: true}))
          .rejects.toBeInstanceOf(ClientError)
    })

    it("should complete all subtasks from a task", async() => {
        const tasks = {
            task1: {
                id: 'major-task',
                description: "random",
                isCompleted: false,
                parentId: null,
                createdAt: new Date(),
                title: "random",
                updatedAt: null
            },
            task2: {
                id: 'sub-major-task',
                description: "random",
                isCompleted: false,
                parentId: "major-task",
                createdAt: new Date(),
                title: "random",
                updatedAt: null
            },
            task3: {
                id: 'sub-major-task',
                description: "random",
                isCompleted: true,
                parentId: "major-task",
                createdAt: new Date(),
                title: "random",
                updatedAt: null
            }
        }

        vi.mocked(prisma.tasks.findUnique).mockResolvedValue(tasks.task1)
        vi.mocked(prisma.tasks.findMany).mockResolvedValueOnce([tasks.task2, tasks.task3])

        await toggleTaskCompletion({taskId: tasks.task1.id, completion:  true})

        expect(prisma.tasks.findMany).toBeCalledTimes(1)
        expect(prisma.tasks.findMany).toHaveBeenCalledWith({
            where: {
                parentId: tasks.task1.id
            }
        })

    })

})