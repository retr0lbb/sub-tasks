import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { recursiveGetSubtasks } from "../../../utils/iterate-over-subtasks";

interface getTaskParams {
	taskId: string;
	projectId: string;
	userId: string;
}

export async function getTask(data: getTaskParams, db: PrismaClient) {
	const project = await db.projects.findUnique({
		where: {
			id: data.projectId,
		},
	});

	if (!project) {
		throw new ClientError("Project does not exists");
	}

	if (project.userId !== data.userId) {
		throw new ClientError("Forbidden");
	}

	const task = await db.tasks.findUnique({
		where: {
			id: data.taskId,
			projectId: data.projectId,
		},
	});

	if (!task) {
		throw new ClientError("Task not found");
	}

	const tasksWithSubtasks = await recursiveGetSubtasks(db, task);

	return tasksWithSubtasks;
}
