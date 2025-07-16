import prisma from "../../../lib/__mocks__/prisma";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createTaskFactory } from "../../../test/factory/task.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import { getAllTasksByProject } from "./get-tasks-by-project";
import { describe, expect, it } from "vitest";

describe("Get Tasks by project", async () => {
	it("Should be able to get all task recursively", async () => {
		const now = new Date();

		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.tasks.findMany.mockResolvedValueOnce([
			createTaskFactory({ createdAt: now }),
		]);

		expect(
			getAllTasksByProject(
				{
					projectId: "valid-project-id",
					userId: "valid-user-id",
				},
				prisma,
			),
		).resolves.toEqual([
			{
				createdAt: now,
				description: "task-description",
				id: "valid-user-id",
				isCompleted: false,
				parentId: null,
				projectId: "valid project id",
				subTasks: [],
				title: "task-title",
				updatedAt: null,
			},
		]);
	});

	it("should return an error if user is not the owner of the project", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.users.findUnique.mockResolvedValue(
			createUserFactory({ id: "other user id" }),
		);
		expect(
			getAllTasksByProject(
				{
					projectId: "valid-project-id",
					userId: "valid-user-id",
				},
				prisma,
			),
		).rejects.toThrowError("User is not the owner of the project");
	});

	it("should return an error if user don't exists", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.users.findUnique.mockResolvedValue(null);

		expect(
			getAllTasksByProject(
				{
					projectId: "valid-project-id",
					userId: "valid-user-id",
				},
				prisma,
			),
		).rejects.toThrowError("User not found");
	});

	it("should return an error if project don't exists", async () => {
		prisma.projects.findUnique.mockResolvedValue(null);

		expect(
			getAllTasksByProject(
				{
					projectId: "valid-project-id",
					userId: "valid-user-id",
				},
				prisma,
			),
		).rejects.toThrowError("Project not found");
	});
});
