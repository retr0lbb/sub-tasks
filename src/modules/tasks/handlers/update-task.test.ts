import { describe, expect, it, vi } from "vitest";
import { updateTask } from "./update-task";
import prisma from "../../../lib/__mocks__/prisma";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createTaskFactory } from "../../../test/factory/task.factory";

describe("Update task test case", () => {
	it("Should be able to update a task without problems", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.tasks.findUnique.mockResolvedValue(createTaskFactory());

		await expect(
			updateTask(
				{
					isCompleted: false,
					description: "Ahem we have desc",
					title: "new-title",
					projectId: "same",
					taskId: "same",
					parentId: null,
					userId: "valid-user-id",
				},
				prisma,
			),
		).resolves.toBeUndefined();
	});

	it("Should be able to be the child of other tasks", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.tasks.findUnique
			.mockResolvedValueOnce(createTaskFactory())
			.mockResolvedValueOnce(
				createTaskFactory({ id: "other-task", title: "other-task" }),
			);

		await expect(
			updateTask(
				{
					isCompleted: false,
					description: "Ahem we have desc",
					title: "new-title",
					projectId: "same",
					taskId: "same",
					parentId: "other-task",
					userId: "valid-user-id",
				},
				prisma,
			),
		).resolves.toBeUndefined();
	});
});
