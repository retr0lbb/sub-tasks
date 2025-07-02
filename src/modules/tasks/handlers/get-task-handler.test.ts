import { describe, expect, it, vi } from "vitest";
import prisma from "../../../lib/__mocks__/prisma";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import { getTask } from "./get-task-handler";
import { createTaskFactory } from "../../../test/factory/task.factory";

describe("Test Case for get tasks", () => {
	it("should get tasks without problems", async () => {
		const now = new Date("2025-07-02T20:46:58.116Z");
		prisma.projects.findUnique.mockResolvedValue(
			createProjectFactory({ userId: "valid-user-id" }),
		);
		prisma.users.findUnique.mockResolvedValue(
			createUserFactory({ id: "valid-user-id" }),
		);
		prisma.tasks.findUnique.mockResolvedValue(
			createTaskFactory({ createdAt: now }),
		);
		prisma.tasks.findMany.mockResolvedValue([]);

		await expect(
			getTask(
				{
					projectId: "some-random-id",
					taskId: "some-random-id",
					userId: "valid-user-id",
				},
				prisma,
			),
		).resolves.toEqual(createTaskFactory({ createdAt: now, subTasks: [] }));
	});
	it("Should return an error of infinite instances of recursion by passing all subtasks all over", async () => {
		const now = new Date("2025-07-02T20:46:58.116Z");
		prisma.projects.findUnique.mockResolvedValue(
			createProjectFactory({ userId: "valid-user-id" }),
		);
		prisma.users.findUnique.mockResolvedValue(
			createUserFactory({ id: "valid-user-id" }),
		);
		prisma.tasks.findUnique.mockResolvedValue(
			createTaskFactory({ createdAt: now }),
		);
		prisma.tasks.findMany.mockResolvedValue([createTaskFactory()]);

		await expect(
			getTask(
				{
					projectId: "some-random-id",
					taskId: "some-random-id",
					userId: "valid-user-id",
				},
				prisma,
			),
		).rejects.toThrowError("Recursion Limit achieved");
	});

	it("Should throw error if project doesn't exist", async () => {
		prisma.projects.findUnique.mockResolvedValue(null);

		await expect(
			getTask(
				{
					projectId: "invalid-id",
					taskId: "valid-task-id",
					userId: "valid-user-id",
				},
				prisma,
			),
		).rejects.toThrowError("Project does not exist");
	});

	it("Should throw an error if user does not exist", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.users.findUnique.mockResolvedValue(null);

		await expect(
			getTask(
				{
					projectId: "invalid-id",
					taskId: "valid-task-id",
					userId: "valid-user-id",
				},
				prisma,
			),
		).rejects.toThrowError("User not found");
	});

	it("Should throw forbidden error if user is not the owner of the project", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.users.findUnique.mockResolvedValue(
			createUserFactory({ id: "other-user-id" }),
		);

		await expect(
			getTask(
				{
					projectId: "invalid-id",
					taskId: "valid-task-id",
					userId: "other-user-id",
				},
				prisma,
			),
		).rejects.toThrowError("Forbidden");
	});

	it("Should return a task with it's subtasks", async () => {
		const now = new Date("2025-07-02T20:46:58.116Z");
		prisma.projects.findUnique.mockResolvedValue(
			createProjectFactory({ userId: "valid-user-id" }),
		);
		prisma.users.findUnique.mockResolvedValue(
			createUserFactory({ id: "valid-user-id" }),
		);
		prisma.tasks.findUnique.mockResolvedValue(
			createTaskFactory({ createdAt: now }),
		);
		prisma.tasks.findMany.mockResolvedValueOnce([
			createTaskFactory({
				title: "child-task",
				createdAt: now,
				parentId: "valid-task-id",
			}),
		]);

		await expect(
			getTask(
				{
					projectId: "some-random-id",
					taskId: "some-random-id",
					userId: "valid-user-id",
				},
				prisma,
			),
		).resolves.toEqual({
			id: "valid-user-id",
			title: "task-title",
			description: "task-description",
			createdAt: now,
			updatedAt: null,
			isCompleted: false,
			parentId: null,
			projectId: "valid project id",
			subTasks: [
				createTaskFactory({
					title: "child-task",
					createdAt: now,
					parentId: "valid-task-id",
					subTasks: [],
				}),
			],
		});
	});
});
