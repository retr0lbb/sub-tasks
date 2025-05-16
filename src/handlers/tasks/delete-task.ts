import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../errors/client-error";
import { getAllTaskIdsRecursively } from "../../utils/get-all-subtasks-id";

export async function deleteTask(taskId: string, db: PrismaClient) {
	const task = await db.tasks.findUnique({
		where: {
			id: taskId,
		},
	});

	if (!task) {
		throw new ClientError("Couldn't find task to delete");
	}

	const allSubtasksRelatedIds = await getAllTaskIdsRecursively(task.id, db);
	const allIds = allSubtasksRelatedIds.map((item) => {
		return item.id;
	});

	await db.tasks.deleteMany({
		where: {
			id: {
				in: allIds,
			},
		},
	});
}
