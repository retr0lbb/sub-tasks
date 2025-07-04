import prisma from "../../../lib/__mocks__/prisma";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createTaskFactory } from "../../../test/factory/task.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import { getAllTasksByProject } from "./get-tasks-by-project";
import { describe, expect, it } from "vitest";

describe("Get Tasks by project", async () => {
	it("Should be able to get all task recursively", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.tasks.findMany.mockResolvedValueOnce([createTaskFactory()]);
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
				createdAt: "2025-07-04T22:06:56.283Z",
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
});
