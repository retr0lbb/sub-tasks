import { describe, it, expect, Mock, vi, should, beforeEach } from "vitest";
import { createTask } from "./create-task-handler";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

vi.mock("../lib/prisma", () => ({
	prisma: {
		tasks: {
			create: vi.fn(),
			findUnique: vi.fn(),
		},
	},
}));

describe("it should create a tasks with no problem", async () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create task", async () => {
		vi.mocked(prisma.tasks.create).mockResolvedValue({
			id: "some-id",
			title: "random",
			description: "random",
			createdAt: new Date(),
			isCompleted: false,
			parentId: null,
			updatedAt: null,
		});

		const createdTask = await createTask({
			title: "random",
			description: "random",
		});

		expect(prisma.tasks.create).toHaveBeenCalled();
		expect(prisma.tasks.create).toHaveBeenCalledWith({
			data: {
				title: "random",
				parentId: undefined,
				description: "random",
			},
		});

		expect(createdTask).toEqual({
			id: "some-id",
			title: "random",
			isCompleted: false,
			description: "random",
			parentId: null,
			updatedAt: null,
			createdAt: expect.any(Date),
		});
	}),
		it("should throws error if cannot create task", async () => {
			vi.mocked(prisma.tasks.create).mockRejectedValue("error");

			const data = {
				title: "random",
				description: "random",
				parentId: undefined,
			};

			await expect(createTask(data)).rejects.toThrow();
		});

	it("should return error if cannot find parent id", async () => {
		const data = {
			title: "random",
			description: "random",
			parentId: "invalid-parentId",
		};

		vi.mocked(prisma.tasks.findUnique).mockResolvedValue(null);

		await expect(createTask(data)).rejects.toBeInstanceOf(ClientError);
	});

	it("should create a task with a valid parent id", async () => {
		const data = {
			title: "random",
			description: "random",
			parentId: "valid-parentId",
		};

		const parentData = {
			title: "parent-title",
			description: "parent-description",
			id: "valid-parentId",
			isCompleted: false,
			createdAt: new Date(),
			updatedAt: null,
			parentId: null,
		};

		vi.mocked(prisma.tasks.findUnique).mockResolvedValue(parentData);
		vi.mocked(prisma.tasks.create).mockResolvedValue({
			id: "some-id",
			title: "random",
			description: "random",
			createdAt: new Date(),
			isCompleted: false,
			parentId: "valid-parentId",
			updatedAt: null,
		});

		const createdTask = await createTask(data);

		expect(createdTask.parentId).toEqual(parentData.id);
		expect(prisma.tasks.create).toHaveBeenCalledWith({ data: data });
	});
});
