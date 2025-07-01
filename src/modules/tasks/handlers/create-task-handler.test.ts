import { createTask } from "./create-task-handler";
import { describe, expect, it, vi } from "vitest";
import prisma from "../../../lib/__mocks__/prisma";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import { createTaskFactory } from "../../../test/factory/task.factory";
import { ClientError } from "../../../errors/client-error";

describe("Create Task Test Case", () => {
	it("Should be able to create task with no problem", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		const task = createTaskFactory();
		prisma.tasks.create.mockResolvedValue(task);

		await expect(
			createTask(
				{
					projectId: "valid-project-id",
					title: "some-title",
					userId: "valid-user-id",
					description: null,
					parentId: null,
				},
				prisma,
			),
		).resolves.toEqual(task);
	});

	it("Should detect if im passing the wrong project id", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());

		await expect(
			createTask(
				{
					projectId: "valid-project-id",
					title: "some-title",
					userId: "other-user-id",
					description: null,
					parentId: null,
				},
				prisma,
			),
		).rejects.toThrowError(
			"cannot create a task to a project that is not yours",
		);
	});

	it("Should return error if project don't exists", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findUnique.mockResolvedValue(null);

		await expect(
			createTask(
				{
					projectId: "valid-project-id",
					title: "some-title",
					userId: "other-user-id",
					description: null,
					parentId: null,
				},
				prisma,
			),
		).rejects.toThrowError("Project not found");
	});

	it("Should return error if user don't exists", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.users.findUnique.mockResolvedValue(null);

		await expect(
			createTask(
				{
					projectId: "valid-project-id",
					title: "some-title",
					userId: "valid-user-id",
					description: null,
					parentId: null,
				},
				prisma,
			),
		).rejects.toThrowError("User not found");
	});

	it("Should return an error if the parent task doesn't exist.", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.tasks.findUnique.mockResolvedValue(null);

		await expect(
			createTask(
				{
					projectId: "valid-project-id",
					title: "some-title",
					parentId: "inexistent-task-id",
					userId: "valid-user-id",
					description: null,
				},
				prisma,
			),
		).rejects.toThrowError("Parent task not found");
	});

	it("Should be able to create an task successfully passing parent id", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.tasks.findUnique.mockResolvedValue(createTaskFactory());

		await expect(
			createTask(
				{
					projectId: "valid-project-id",
					title: "some-title",
					parentId: "inexistent-task-id",
					userId: "valid-user-id",
					description: null,
				},
				prisma,
			),
		).resolves.toBeUndefined();
	});
});
