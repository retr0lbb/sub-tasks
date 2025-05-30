import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";

interface UpdateTaskSearchIds {
	taskId: string;
	projectId: string;
	userId: string;
}

interface UpdateTaskBody {
	title: string | undefined;
	description: string | null | undefined;
	parentId: string | null | undefined;
	isCompleted: boolean | undefined;
}

export async function updateTask(
	{ projectId, taskId, userId }: UpdateTaskSearchIds,
	body: UpdateTaskBody,
	db: PrismaClient,
) {
	const project = await db.projects.findUnique({
		where: {
			id: projectId,
		},
	});

	if (!project) {
		throw new ClientError("Cant find project");
	}

	if (project.userId !== userId) {
		throw new ClientError("Forbidden");
	}

	const task = await db.tasks.findUnique({
		where: {
			id: taskId,
		},
	});

	if (!task) {
		throw new ClientError("Task not found");
	}

	await db.tasks.update({
		where: {
			id: taskId,
		},
		data: {
			updatedAt: new Date(),
			...body,
		},
	});
}
