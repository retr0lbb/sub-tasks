import { vi, describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/prisma";
import { getAllTasksByProject } from "./get-tasks-by-project";
import { ClientError } from "../errors/client-error";

vi.mock("../lib/prisma", () => ({
	prisma: {
		tasks: {
			findMany: vi.fn(),
		},
	},
}));

describe("Should get tasks and subtask", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it("should return an array of tasks with the respective subtasks", async () => {
		const tasks = [
			{
				createdAt: new Date(),
				description: "random",
				isCompleted: false,
				id: "major-task",
				parentId: null,
				title: "major-task",
				updatedAt: null,
			},
			{
				createdAt: new Date(),
				description: "random2",
				isCompleted: false,
				id: "sub-task1",
				parentId: "major-task",
				title: "sub-task",
				updatedAt: null,
			},
			{
				createdAt: new Date(),
				description: "random3",
				isCompleted: false,
				id: "sub-sub-task",
				parentId: "sub-task1",
				title: "sub-sub-task1",
				updatedAt: null,
			},
			{
				createdAt: new Date(),
				description: "random",
				isCompleted: false,
				id: "sub-task2",
				parentId: "major-task",
				title: "major-task",
				updatedAt: null,
			},
		];

		vi.mocked(prisma.tasks.findMany).mockResolvedValue(tasks);

		const { tasks: taskList } = await getTasksAndSubtasks({});

		expect(taskList.length).toEqual(1);
	});

	it("should return an empty array if isnt any tasks", async () => {
		vi.mocked(prisma.tasks.findMany).mockResolvedValue([]);

		const { tasks: taskList } = await getTasksAndSubtasks({});

		expect(taskList).toEqual([]);
		expect(taskList.length).toEqual(0);
	});

	it("should paginate correctly", async () => {
		const tasks = [
			{
				createdAt: new Date(),
				description: "random",
				isCompleted: false,
				id: "major-task",
				parentId: null,
				title: "major-task",
				updatedAt: null,
			},
			{
				createdAt: new Date(),
				description: "random2",
				isCompleted: false,
				id: "sub-task1",
				parentId: null,
				title: "sub-task",
				updatedAt: null,
			},
			{
				createdAt: new Date(),
				description: "random3",
				isCompleted: false,
				id: "sub-sub-task",
				parentId: null,
				title: "sub-sub-task1",
				updatedAt: null,
			},
			{
				createdAt: new Date(),
				description: "random",
				isCompleted: false,
				id: "sub-task2",
				parentId: "major-task",
				title: "major-task",
				updatedAt: null,
			},
		];

		const numberOfRegistersPerPage = 2;

		vi.mocked(prisma.tasks.findMany).mockResolvedValue(tasks);

		const { tasks: taskList } = await getTasksAndSubtasks({
			numbersPerpage: numberOfRegistersPerPage,
			page: 0,
		});

		expect(taskList.length).lessThanOrEqual(numberOfRegistersPerPage);
	});

	it("shold return corret number of registries", async () => {
		vi.mocked(prisma.tasks.findMany).mockResolvedValue(
			Array.from({ length: 50 }, (_, index) => {
				return {
					createdAt: new Date(),
					description: "",
					isCompleted: false,
					id: `${index}`,
					title: `task-${index + 1}`,
					parentId: null,
					updatedAt: null,
				};
			}),
		);

		const { tasks, numberOfEntries } = await getTasksAndSubtasks({
			numbersPerpage: 10,
			page: 1,
		});

		expect(numberOfEntries).toEqual(50);
		expect(tasks.length).toEqual(10);
		expect(Math.floor(numberOfEntries / 10)).toEqual(5);
	});

	it("should throw error if access a out of bounds page", async () => {
		vi.mocked(prisma.tasks.findMany).mockResolvedValue(
			Array.from({ length: 10 }, (_, index) => {
				return {
					createdAt: new Date(),
					description: "",
					isCompleted: false,
					id: `${index}`,
					title: `task-${index + 1}`,
					parentId: null,
					updatedAt: null,
				};
			}),
		);

		await expect(
			getTasksAndSubtasks({ page: 2, numbersPerpage: 10 }),
		).rejects.toBeInstanceOf(ClientError);
	});
});
