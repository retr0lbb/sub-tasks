import type { PrismaClient } from "@prisma/client";

export async function validateUserProject(
	userId: string,
	projectId: string,
	db: PrismaClient,
) {
	const project = await db.projects.findUnique({
		where: {
			id: projectId,
		},
	});
	if (!project) {
		return false;
	}
	if (project.userId !== userId) {
		return false;
	}
	const user = await db.users.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		return false;
	}

	return true;
}
