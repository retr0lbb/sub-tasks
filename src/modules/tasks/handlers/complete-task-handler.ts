import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";

interface CompleteTaskParams {
	taskId: string;
	isCompleted: boolean;
}

export async function toggleTaskCompletion(
	{ taskId, isCompleted }: CompleteTaskParams,
	db: PrismaClient,
) {
	const task = await db.tasks.findUnique({
		where: {
			id: taskId,
		},
	});

	if (!task) {
		throw new ClientError("Task not found");
	}

	const tasksIdAndParentId = await getAllTaskIdsRecursively(task.id, db);
	const taskIds = tasksIdAndParentId.map((item) => {
		return item.id;
	});

	await db.tasks.updateMany({
		data: {
			isCompleted,
			updatedAt: new Date(),
		},
		where: {
			id: { in: taskIds },
		},
	});
}

interface TasksIdAndParentId {
	id: string;
	parentId: string | null;
}

async function getAllTaskIdsRecursively(
	parentTaskId: string,
	db: PrismaClient,
): Promise<TasksIdAndParentId[]> {
	const subtasks = await db.tasks.findMany({
		where: { parentId: parentTaskId },
		select: { id: true, parentId: true },
	});

	const nestedTasks = await Promise.all(
		subtasks.map((task) => getAllTaskIdsRecursively(task.id, db)),
	);

	return [
		{ id: parentTaskId, parentId: null },
		...subtasks,
		...nestedTasks.flat(),
	];
}
