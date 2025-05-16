import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";

interface getTaskParams {
	id: string;
}

export async function getTask({ id }: getTaskParams) {
	const task = await prisma.tasks.findUnique({
		where: {
			id,
		},
	});

	if (!task) {
		throw new ClientError("Task not found");
	}

	return task;
}
