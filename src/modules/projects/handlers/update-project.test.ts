import { describe, expect, it } from "vitest";
import { updateProject } from "./update-project";
import prisma from "../../../lib/__mocks__/prisma";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { ClientError } from "../../../errors/client-error";

describe("Update project test case(UNIT TEST)", () => {
	it("Should be able to update a project successfully", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.projects.update.mockResolvedValue({
			id: "found-id",
			userId: "valid-user-id",
			description: "new-desc",
			name: "new-name",
		});

		await expect(
			updateProject(
				{
					projectId: "found-id",
					userId: "valid-user-id",
					description: "new-desc",
					name: "new-name",
				},
				prisma,
			),
		).resolves.toEqual({
			name: "new-name",
			description: "new-desc",
			userId: "valid-user-id",
			id: "found-id",
		});
	});

	it("should return an error if user isn't the owner of the project", async () => {
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());
		prisma.projects.update.mockResolvedValue({
			id: "found-id",
			userId: "valid-user-id",
			description: "new-desc",
			name: "new-name",
		});

		await expect(
			updateProject(
				{
					projectId: "found-id",
					userId: "invalid-user-id",
					description: "new-desc",
					name: "new-name",
				},
				prisma,
			),
		).rejects.toThrow("Forbidden");
	});

	it("should return an error if project doesn't exists", async () => {
		prisma.projects.findUnique.mockResolvedValue(null);

		await expect(
			updateProject(
				{
					projectId: "found-id",
					userId: "invalid-user-id",
					description: "new-desc",
					name: "new-name",
				},
				prisma,
			),
		).rejects.toThrow("Project Not Found");
	});
});
