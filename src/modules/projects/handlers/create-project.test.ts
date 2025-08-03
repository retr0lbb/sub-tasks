import { describe, expect, it } from "vitest";
import { createProject } from "./create-project";
import prisma from "../../../lib/__mocks__/prisma";
import { createUserFactory } from "../../../test/factory/user.factory";
import { ClientError } from "../../../errors/client-error";

describe("Create project unit test case", () => {
	it("Should create a project successfully", async () => {
		prisma.users.findUnique.mockResolvedValue(
			createUserFactory({ id: "user-id" }),
		);
		await expect(
			createProject(
				{
					description: "Some",
					name: "some-name",
					userId: "user-id",
				},
				prisma,
			),
		).resolves.toBeUndefined();
	});
	it("Should throw error if user don't exists", async () => {
		prisma.users.findUnique.mockResolvedValue(null);
		await expect(
			createProject(
				{
					description: "Some",
					name: "some-name",
					userId: "user-id",
				},
				prisma,
			),
		).rejects.toThrowError(ClientError);
	});
});
