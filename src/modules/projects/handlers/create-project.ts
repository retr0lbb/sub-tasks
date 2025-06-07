import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import type { CreateProjectBody } from "../dtos/create-project.dto";
import type { RequestUser } from "../../../utils/request-user.type";

export async function createProject(
	data: CreateProjectBody & RequestUser,
	db: PrismaClient,
) {
	const user = await db.users.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user) {
		throw new ClientError("User doesn't exists");
	}

	const project = await db.projects.create({
		data: {
			name: data.description,
			description: data.description,
			userId: data.userId,
		},
	});

	return project;
}
