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
});
