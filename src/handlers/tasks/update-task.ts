import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../errors/client-error";

interface UpdateTaskBody {
	title: string | undefined;
	description: string | null | undefined;
	parentId: string | null | undefined;
	isCompleted: boolean | undefined;
}

export async function updateTask(
	taskId: string,
	body: UpdateTaskBody,
	db: PrismaClient,
) {
	const task = await db.tasks.findUnique({
		where: {
			id: taskId,
		},
	});

	if (!task) {
		throw new ClientError("Task not found");
	}

	await db.tasks.update({
		where: {
			id: taskId,
		},
		data: {
			updatedAt: new Date(),
			...body,
		},
	});
}
