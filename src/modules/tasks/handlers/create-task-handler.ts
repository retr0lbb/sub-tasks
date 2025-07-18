import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import type { CreateTaskBody, CreateTaskParams } from "../dtos/create-task.dto";

export async function createTask(
	data: CreateTaskBody & CreateTaskParams & { userId: string },
	db: PrismaClient,
) {
	if (!data.userId) {
		throw new ClientError("You must be register to it");
	}
	const project = await db.projects.findUnique({
		where: {
			id: data.projectId,
		},
	});

	if (!project) {
		throw new ClientError("Project not found");
	}

	if (project.userId !== data.userId) {
		throw new ClientError(
			"cannot create a task to a project that is not yours",
		);
	}

	const user = await db.users.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	if (data.parentId !== null && data.parentId !== undefined) {
		const parentTask = await db.tasks.findUnique({
			where: {
				id: data.parentId,
			},
		});

		if (parentTask === null && !parentTask) {
			throw new ClientError("Parent task not found");
		}
	}

	const result = await db.tasks.create({
		data: {
			title: data.title,
			description: data.description,
			parentId: data.parentId,
			projectId: data.projectId,
		},
	});

	return result;
}
