import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import type {
	ToggleTaskCompletionBody,
	ToggleTaskCompletionParams,
} from "../dtos/toggle-task-completion.dto";
import type { RequestUser } from "../../../utils/request-user.type";

export async function toggleTaskCompletion(
	data: ToggleTaskCompletionBody & ToggleTaskCompletionParams & RequestUser,
	db: PrismaClient,
) {
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
			AND: {
				userId: data.userId,
			},
		},
	});

	if (!project) {
		throw new ClientError("Project does not exists");
	}

	const task = await db.tasks.findUnique({
		where: {
			id: data.taskId,
			AND: {
				projectId: data.projectId,
			},
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
			isCompleted: data.isCompleted,
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
