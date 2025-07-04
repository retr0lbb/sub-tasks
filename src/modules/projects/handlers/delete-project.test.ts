import { ClientError } from "../../../errors/client-error";
import prisma from "../../../lib/__mocks__/prisma";
import { createProjectFactory } from "../../../test/factory/project.factory";
import { createUserFactory } from "../../../test/factory/user.factory";
import { deleteProject } from "./delete-project";
import { describe, expect, it, vi } from "vitest";

describe("Delete project Test case", () => {
	it("Should be able to delete project successfully", async () => {
		prisma.users.findUnique.mockResolvedValue(createUserFactory());

		await expect(
			deleteProject(
				{ projectId: "valid-project-id", userId: "valid-user-id" },
				prisma,
			),
		).resolves.toBeUndefined();
	});

	it("Should return error if the user haven't been found", async () => {
		prisma.users.findUnique.mockResolvedValue(null);

		await expect(
			deleteProject(
				{ projectId: "valid-project-id", userId: "valid-user-id" },
				prisma,
			),
		).rejects.toThrowError(ClientError);
	});

	it("should return error if user id don't match with project user id", async () => {
		prisma.users.findUnique.mockResolvedValue(
			createUserFactory({ id: "other-d" }),
		);
		prisma.projects.findUnique.mockResolvedValue(createProjectFactory());

		await expect(
			deleteProject(
				{ projectId: "valid-project-id", userId: "valid-user-id" },
				prisma,
			),
		).rejects.toThrowError("Cannot delete a project that is not yours");
	});
});
