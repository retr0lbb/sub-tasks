import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../errors/client-error";

export interface TaskWithSubtasks {
	id: string;
	description: string | null;
	title: string;
	createdAt: Date;
	updatedAt: Date | null;
	isCompleted: boolean;
	parentId: string | null;
	subTasks: TaskWithSubtasks[];
}

export async function recursiveGetSubtasks(
	db: PrismaClient,
	task: Omit<TaskWithSubtasks, "subTasks"> | null,
	max_depth: number,
	depth = 0,
): Promise<TaskWithSubtasks> {
	const maxDepth = max_depth;

	if (!task) throw new ClientError("Task not found");

	if (depth >= max_depth) {
		return {
			...task,
			subTasks: [],
		};
	}

	if (depth >= 10_000) {
		throw new Error("Recursion Limit achieved");
	}

	const subtasks =
		(await db.tasks.findMany({
			where: {
				parentId: task.id,
			},
		})) || [];

	const formattedSubtasks = await Promise.all(
		subtasks.map(
			async (sub) => await recursiveGetSubtasks(db, sub, maxDepth, depth + 1),
		),
	);

	return {
		...task,
		subTasks: formattedSubtasks,
	};
}
