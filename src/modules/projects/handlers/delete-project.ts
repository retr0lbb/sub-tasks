import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import type { RequestUser } from "../../../utils/request-user.type";
import type { DeleteProjectParams } from "../dtos/delete-project.dto";

export async function deleteProject(
	data: RequestUser & DeleteProjectParams,
	db: PrismaClient,
) {
	const user = await db.users.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user) {
		throw new ClientError("Couldn't find any user");
	}

	const project = await db.projects.findUnique({
		where: {
			id: data.projectId,
		},
	});

	if (!project) {
		throw new ClientError("This project already doesn't exists.");
	}

	if (project.userId !== null && project.userId !== data.userId) {
		throw new ClientError("Cannot delete a project that is not yours");
	}

	await db.projects.delete({
		where: {
			id: data.projectId,
		},
	});
}
