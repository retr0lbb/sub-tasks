import type { PrismaClient } from "@prisma/client";

interface TasksIdAndParentId {
	id: string;
	parentId: string | null;
}

export async function getAllTaskIdsRecursively(
	parentTaskId: string,
	db: PrismaClient,
	recursion = 0,
): Promise<TasksIdAndParentId[]> {
	const MAX_RECURSION = 1000;

	if (recursion > MAX_RECURSION) {
		throw new Error("Max recursion depth achieved");
	}

	const subtasks =
		(await db.tasks.findMany({
			where: { parentId: parentTaskId },
			select: { id: true, parentId: true },
		})) || [];

	const nestedTasks = await Promise.all(
		subtasks.map((task) =>
			getAllTaskIdsRecursively(task.id, db, recursion + 1),
		),
	);

	return [
		{ id: parentTaskId, parentId: null },
		...subtasks,
		...nestedTasks.flat(),
	];
}
