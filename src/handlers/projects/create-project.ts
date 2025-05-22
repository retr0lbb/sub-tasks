import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../errors/client-error";

interface ProjectProps {
	name: string;
	description: string;
	userId: string;
}

export async function createProject(db: PrismaClient, data: ProjectProps) {
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
