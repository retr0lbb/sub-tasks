import { ClientError } from "../../../errors/client-error";
import type { PrismaClient } from "@prisma/client";
import { recursiveGetSubtasks } from "../../../utils/iterate-over-subtasks";

interface GetAllTasksByProjectProps {
	projectId: string;
	userId: string;
}

export async function getAllTasksByProject(
	db: PrismaClient,
	data: GetAllTasksByProjectProps,
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
		throw new ClientError("Forbidden");
	}

	const user = await db.users.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user) {
		throw new ClientError("User not found in our database");
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
