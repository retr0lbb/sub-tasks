import { ClientError } from "../../errors/client-error";
import type { PrismaClient } from "@prisma/client";
import { recursiveGetSubtasks } from "../../utils/iterate-over-subtasks";

interface GetAllTasksByProjectProps {
	projectId: string;
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

	const topLevelTasks = await db.tasks.findMany({
		where: {
			projectIdId: data.projectId,
			parentId: null,
		},
		omit: {
			projectIdId: true,
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
