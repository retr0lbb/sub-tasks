import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import type { UpdateBody, UpdateParams } from "../dtos/update-project.dto";
import type { RequestUser } from "../../../utils/request-user.type";

export async function updateProject(
	data: UpdateBody & UpdateParams & RequestUser,
	db: PrismaClient,
) {
	const project = await db.projects.findUnique({
		where: {
			id: data.projectId,
		},
	});

	if (!project) {
		throw new ClientError("Project Not Found");
	}
	if (project.userId !== data.userId) {
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
