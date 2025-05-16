import type { PrismaClient } from "@prisma/client";

interface TasksIdAndParentId {
	id: string;
	parentId: string | null;
}

export async function getAllTaskIdsRecursively(
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
