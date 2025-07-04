import { ClientError } from "../../../errors/client-error";
import type { PrismaClient } from "@prisma/client";
import { recursiveGetSubtasks } from "../../../utils/iterate-over-subtasks";
import type { GetTasksByProjectParams } from "../dtos/get-tasks-by-project.dto";
import type { RequestUser } from "../../../utils/request-user.type";

export async function getAllTasksByProject(
	data: GetTasksByProjectParams & RequestUser,
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

	const user = await db.users.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user) {
		throw new ClientError("User not found");
	}

	if (project.userId !== user.id) {
		throw new ClientError("Forbidden");
	}

	const topLevelTasks = await db.tasks.findMany({
		where: {
			projectId: data.projectId,
			parentId: null,
		},
		omit: {
			projectId: true,
		},
	});

	if (topLevelTasks.length === 0) {
		return [];
	}

	const allTasks = await Promise.all(
		topLevelTasks.map(async (task) => {
			return await recursiveGetSubtasks(db, task);
		}),
	);
	return allTasks;
}
