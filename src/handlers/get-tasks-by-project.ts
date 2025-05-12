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
		include: {
			SubTasks: true,
		},
	});

	if (topLevelTasks.length <= 0) {
		throw new ClientError("No tasks found");
	}

	console.log(topLevelTasks);

	return topLevelTasks;
}
