import prisma from "../../../lib/__mocks__/prisma";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createTaskFactory } from "../../../test/factory/task.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import { listUserProjects } from "./list-user-projects";
import { describe, expect, it } from "vitest";

describe("List user projects Test Case", async () => {
	it("Should be able to return all user projects", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());
		prisma.projects.findMany.mockResolvedValue([createProjectFactory()]);
		await expect(listUserProjects("valid-user-id", prisma)).resolves.toEqual([
			{
				description: "project-description",
				id: "valid-project-id",
				name: "project-name",
				userId: "valid-user-id",
			},
		]);
	});

	it("Should return an error if user doesn't exists", async () => {
		prisma.users.findUnique.mockResolvedValue(null);
		await expect(listUserProjects("valid-user-id", prisma)).rejects.toThrow(
			"User not found",
		);
	});
});
