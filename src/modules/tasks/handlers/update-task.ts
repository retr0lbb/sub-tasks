import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import type { UpdateTaskBody, UpdateTaskParams } from "../dtos/update-task.dto";
import type { RequestUser } from "../../../utils/request-user.type";
import { detectLoop } from "../../../utils/detect-loop";

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
		throw new ClientError("Project not found");
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

	if (data.parentId && data.parentId === task.id) {
		throw new ClientError("Task cannot be the parent of itself");
	}

	if (data.parentId && (await detectLoop(task.id, data.parentId, db))) {
		throw new ClientError("Task cannot be a child of one of its descendants");
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
}
