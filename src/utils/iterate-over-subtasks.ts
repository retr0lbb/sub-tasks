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
	depth = 0,
): Promise<TaskWithSubtasks> {
	const maxDepth = 2_000;

	if (depth > maxDepth) {
		throw new Error("Recursion Limit achieved");
	}

	if (!task) throw new ClientError("Task not found");

	const subtasks =
		(await db.tasks.findMany({
			where: {
				parentId: task.id,
			},
		})) || [];

	const formattedSubtasks = await Promise.all(
		subtasks.map(async (sub) => await recursiveGetSubtasks(db, sub, depth + 1)),
	);

	return {
		...task,
		subTasks: formattedSubtasks,
	};
}
