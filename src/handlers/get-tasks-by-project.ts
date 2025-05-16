import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import type { PrismaClient } from "@prisma/client";

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

interface TaskWithSubtasks {
	id: string;
	description: string | null;
	title: string;
	createdAt: Date;
	updatedAt: Date | null;
	isCompleted: boolean;
	parentId: string | null;
	subTasks: TaskWithSubtasks[];
}

async function recursiveGetSubtasks(
	db: PrismaClient,
	task: Omit<TaskWithSubtasks, "subTasks"> | null,
): Promise<TaskWithSubtasks> {
	if (!task) throw new ClientError("Task not found");

	const subtasks = await db.tasks.findMany({
		where: {
			parentId: task.id,
		},
	});

	const formattedSubtasks = await Promise.all(
		subtasks.map(async (sub) => await recursiveGetSubtasks(db, sub)),
	);

	return {
		...task,
		subTasks: formattedSubtasks,
	};
}
