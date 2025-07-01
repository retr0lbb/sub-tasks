import prisma from "../../../lib/__mocks__/prisma";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createTaskFactory } from "../../../test/factory/task.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import { deleteTask } from "./delete-task";
import { describe, expect, it, vi } from "vitest";

describe("Delete Task test case", () => {
	it("Should be able to delete an task without problems", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.tasks.findUnique.mockResolvedValue(createTaskFactory());
		prisma.tasks.findMany.mockResolvedValue([]);
		await expect(
			deleteTask(
				{
					projectId: "valid-project-id",
					taskId: "valid-task-id",
					userId: "valid-user-id ",
				},
				prisma,
			),
		).resolves.toBeUndefined();
	});

	it("should be able to delete the task and its subtasks", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.tasks.findUnique.mockResolvedValue(createTaskFactory());
		prisma.tasks.findMany.mockResolvedValueOnce([
			createTaskFactory({ parentId: "valid-user-id", id: "other-id" }),
		]);
		await expect(
			deleteTask(
				{
					projectId: "valid-project-id",
					taskId: "valid-task-id",
					userId: "valid-user-id ",
				},
				prisma,
			),
		).resolves.toBeUndefined();

		expect(prisma.tasks.deleteMany).toHaveBeenCalled();
	});

	it("Should return an error if it cant find the project", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(null);

		await expect(
			deleteTask(
				{
					projectId: "valid-project-id",
					taskId: "valid-task-id",
					userId: "valid-user-id ",
				},
				prisma,
			),
		).rejects.toThrowError("Project does not exists");
	});

	it("Should return an error if it cant find user", async () => {
		prisma.users.findUnique.mockResolvedValue(null);

		await expect(
			deleteTask(
				{
					projectId: "valid-project-id",
					taskId: "valid-task-id",
					userId: "valid-user-id ",
				},
				prisma,
			),
		).rejects.toThrowError("User don't exists");
	});

	it("Should return an error if user is not the owner of the project", async () => {
		prisma.users.findUnique.mockResolvedValue(
			createUserFactory({ id: "invalid-id" }),
		);
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());

		await expect(
			deleteTask(
				{
					projectId: "valid-project-id",
					taskId: "valid-task-id",
					userId: "invalid-user-id ",
				},
				prisma,
			),
		).rejects.toThrowError("Project does not exists");
	});
});
