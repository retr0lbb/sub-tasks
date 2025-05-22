import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { recursiveGetSubtasks } from "../../../utils/iterate-over-subtasks";

interface getTaskParams {
	id: string;
}

export async function getTask({ id }: getTaskParams, db: PrismaClient) {
	const task = await db.tasks.findUnique({
		where: {
			id,
		},
	});

	if (!task) {
		throw new ClientError("Task not found");
	}

	const tasksWithSubtasks = await recursiveGetSubtasks(db, task);

	return tasksWithSubtasks;
}
