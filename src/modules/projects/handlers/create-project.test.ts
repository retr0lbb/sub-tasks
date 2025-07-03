import { describe, expect, it } from "vitest";
import { createProject } from "./create-project";
import prisma from "../../../lib/__mocks__/prisma";
import { createUserFactory } from "../../../test/factory/user.factory";

describe("Create project test case", () => {
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
});
