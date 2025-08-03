import { beforeEach, describe, it } from "vitest";
import { createProjectHandler } from "./create-project.route";
import type { FastifyRequest, FastifyReply } from "fastify";

describe("Create project integration test case", () => {
	let request = {} as FastifyRequest;
	let reply = {} as FastifyReply;

	beforeEach(() => {
		request = {} as FastifyRequest;
		reply = {} as FastifyReply;
	});

	it("Should validate all input fields", async () => {
		request.body = { name: "project-name", description: "some-desc" };
		request.user = { id: "valid-user-id" };
	});
});
