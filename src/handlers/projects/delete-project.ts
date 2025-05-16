import type { PrismaClient } from "@prisma/client";

interface DeleteProjectProps {
	projectId: string;
}
export async function deleteProject(
	data: DeleteProjectProps,
	db: PrismaClient,
) {
	await db.projects.delete({
		where: {
			id: data.projectId,
		},
	});
}
