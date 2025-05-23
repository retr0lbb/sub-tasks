import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";

interface projectData {
	userId?: string | undefined;
	description?: string | undefined | null;
	name?: string | undefined;
}
export async function updateProject(
	data: projectData,
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
		throw new ClientError("Couldn't find project");
	}
	if (project.userId !== userId) {
		throw new ClientError("Forbidden");
	}

	const updatedProject = await db.projects.update({
		data: {
			description: data.description ?? "",
			name: data.name,
			userId: data.userId,
		},
		where: {
			id: project.id,
		},
	});

	return updatedProject;
}
