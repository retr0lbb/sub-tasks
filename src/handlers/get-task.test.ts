import { describe, it, expect, Mock, vi, should, beforeEach} from "vitest";
import { createTask } from "./create-task-handler"
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { getTask } from "./get-task-handler";
import { any, date } from "zod";


vi.mock("../lib/prisma", () => ({
    prisma: {
      tasks: {
        findUnique: vi.fn()
      },
    },
}));


describe("it should get one task", async () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    it("Should get a task", async() => {
        vi.mocked(prisma.tasks.findUnique).mockResolvedValue({
            id: 'major-task',
            description: "random",
            isCompleted: false,
            parentId: null,
            createdAt: new Date(),
            title: "random",
            updatedAt: null
        })


        const task = await getTask({id: "major-task"})

        expect(task).toEqual({
            id: 'major-task',
            description: "random",
            isCompleted: false,
            parentId: null,
            createdAt: expect.any(Date),
            title: "random",
            updatedAt: null
        })

    })

    it("Should return error if task is not found", async() => {
        vi.mocked(prisma.tasks.findUnique).mockResolvedValue(null)

        await expect(getTask({id: "major-task"})).rejects.toBeInstanceOf(ClientError)
    })
})