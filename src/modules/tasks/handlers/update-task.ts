import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import type { UpdateTaskBody, UpdateTaskParams } from "../dtos/update-task.dto";
import type { RequestUser } from "../../../utils/request-user.type";

export async function updateTask(
	data: UpdateTaskBody & UpdateTaskParams & RequestUser,
	db: PrismaClient,
) {
	const project = await db.projects.findUnique({
		where: {
			id: data.projectId,
		},
	});

	if (!project) {
		throw new ClientError("Cant find project");
	}

	if (project.userId !== data.userId) {
		console.log("something went wrong");
		throw new ClientError("Forbidden");
	}

	const task = await db.tasks.findUnique({
		where: {
			id: data.taskId,
		},
	});

	if (!task) {
		throw new ClientError("Task not found");
	}

	await db.tasks.update({
		where: {
			id: data.taskId,
		},
		data: {
			updatedAt: new Date(),
			description: data.description,
			isCompleted: data.isCompleted,
			parentId: data.parentId,
			projectId: data.projectId,
			title: data.title,
		},
	});

	return;
}
