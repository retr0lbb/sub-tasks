import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { getAllTaskIdsRecursively } from "../../../utils/get-all-subtasks-id";
import { validateUserProject } from "../../../utils/validate-user-project";

interface deleteTaskDTO {
	taskId: string;
	projectId: string;
	userId: string;
}

export async function deleteTask(data: deleteTaskDTO, db: PrismaClient) {
	if ((await validateUserProject(data.userId, data.projectId, db)) === false) {
		throw new ClientError("Cannot verify If user Project is valid");
	}

	const task = await db.tasks.findUnique({
		where: {
			id: data.taskId,
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

	return;
}
