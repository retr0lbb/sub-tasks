import { describe, it, expect, vi } from "vitest";
import { toggleTaskCompletion } from "./complete-task-handler";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createTaskFactory } from "../../../test/factory/task.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import prisma from "../../../lib/__mocks__/prisma";
import { ClientError } from "../../../errors/client-error";

describe("complete task handler test case", () => {
	it("Should complete a task without errors", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.tasks.findUnique.mockResolvedValue(createTaskFactory());
		prisma.tasks.findMany.mockResolvedValue([]);
		prisma.tasks.updateMany.mockResolvedValue({ count: 1 });

		await expect(
			toggleTaskCompletion(
				{
					userId: "user-id",
					projectId: "project-id",
					taskId: "task-id",
					isCompleted: true,
				},
				prisma,
			),
		).resolves.toBeUndefined();
		expect(prisma.tasks.updateMany).toHaveBeenCalledOnce();
	});

	it("Should return error if project not found", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(null);

		await expect(
			toggleTaskCompletion(
				{
					userId: "user-id",
					projectId: "project-id",
					taskId: "task-id",
					isCompleted: true,
				},
				prisma,
			),
		).rejects.toThrowError("Project does not exists");
	});

	it("Should return error if user not found", async () => {
		prisma.users.findUnique.mockResolvedValue(null);

		await expect(
			toggleTaskCompletion(
				{
					userId: "user-id",
					projectId: "project-id",
					taskId: "task-id",
					isCompleted: true,
				},
				prisma,
			),
		).rejects.toThrowError("User don't exists");
	});

	it("Should return error if task not found", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.tasks.findUnique.mockResolvedValue(null);

		await expect(
			toggleTaskCompletion(
				{
					userId: "user-id",
					projectId: "project-id",
					taskId: "task-id",
					isCompleted: true,
				},
				prisma,
			),
		).rejects.toThrowError(ClientError);
	});

	it("Should complete tasks and it subtasks", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.tasks.findUnique.mockResolvedValue(createTaskFactory());
		prisma.tasks.findMany.mockResolvedValueOnce([
			createTaskFactory({ parentId: "valid-user-id", id: "other-id" }),
		]);
		prisma.tasks.updateMany.mockResolvedValue({ count: 2 });

		await expect(
			toggleTaskCompletion(
				{
					isCompleted: true,
					projectId: createProjectFactory().id,
					taskId: createTaskFactory().id,
					userId: createUserFactory().id,
				},
				prisma,
			),
		).resolves;
	});
});
