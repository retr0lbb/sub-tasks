import { ClientError } from "../errors/client-error";
import { prisma } from "../lib/prisma";

interface CompleteTaskParams {
	taskId: string;
	completion: boolean;
}

export async function toggleTaskCompletion({
	taskId,
	completion,
}: CompleteTaskParams) {
	const task = await prisma.tasks.findUnique({
		where: {
			id: taskId,
		},
	});

	if (!task) {
		throw new ClientError("Task not found");
	}

	if (task.isCompleted === completion) {
		throw new ClientError(
			`the task is already ${completion ? "completed" : "uncompleted"}`,
		);
	}

	async function completeSubtask(taskId: string, completion: boolean) {
		const subtasks = await prisma.tasks.findMany({
			where: {
				parentId: taskId,
			},
		});

		await prisma.tasks.update({
			where: {
				id: taskId,
			},
			data: {
				isCompleted: completion,
				updatedAt: new Date(),
			},
		});

		for (const subtask of subtasks) {
			await completeSubtask(subtask.id, completion);
		}
	}

	completeSubtask(taskId, completion);
}
