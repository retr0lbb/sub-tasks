import type { PrismaClient } from "@prisma/client/extension";
import { ClientError } from "../errors/client-error";

export async function detectLoop(
	taskId: string,
	potentialParentId: string,
	db: PrismaClient,
): Promise<boolean> {
	let currentParentId = potentialParentId;

	//Just for control
	let iteration = 0;
	const maxIteration = 1_000;

	while (currentParentId && iteration < maxIteration) {
		if (currentParentId === taskId) {
			return true;
		}

		const parentTask = await db.tasks.findUnique({
			where: { id: currentParentId },
			select: { parentId: true },
		});

		if (!parentTask) break;

		currentParentId = parentTask.parentId ?? null;
		iteration += 1;
	}

	if (iteration === maxIteration) {
		throw new ClientError(
			"Maximum depth exceeded. Possible circular reference.",
		);
	}

	return false;
}
