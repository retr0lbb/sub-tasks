import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { recursiveGetSubtasks } from "../../../utils/iterate-over-subtasks";
import type { GetTasksParams } from "../dtos/get-task.dto";
import type { RequestUser } from "../../../utils/request-user.type";

export async function getTask(
	data: GetTasksParams & RequestUser,
	db: PrismaClient,
) {
	const project = await db.projects.findUnique({
		where: {
			id: data.projectId,
		},
	});

	if (!project) {
		throw new ClientError("Project does not exists");
	}

	const user = await db.users.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user) {
		throw new ClientError("User not found");
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
