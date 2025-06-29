import { describe, it, expect, vi } from "vitest";
import { toggleTaskCompletion } from "./complete-task-handler";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createTaskFactory } from "../../../test/factory/task.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import prisma from "../../../lib/__mocks__/prisma";

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
});
