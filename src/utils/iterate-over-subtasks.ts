import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../errors/client-error";

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

export async function recursiveGetSubtasks(
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
