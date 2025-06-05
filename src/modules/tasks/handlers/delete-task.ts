import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { getAllTaskIdsRecursively } from "../../../utils/get-all-subtasks-id";

interface deleteTaskDTO {
	taskId: string;
	projectId: string;
	userId: string;
}

export async function deleteTask(data: deleteTaskDTO, db: PrismaClient) {
	const user = await db.users.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user) {
		throw new ClientError("User don't exists");
	}

	const project = await db.projects.findUnique({
		where: {
			id: data.projectId,
			userId: data.userId,
		},
	});

	if (!project || project.userId !== user.id) {
		throw new ClientError("Project does not exists");
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
