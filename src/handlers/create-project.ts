import type { PrismaClient } from "@prisma/client";
interface ProjectProps {
	name: string;
	description: string;
}

export async function createProject(
	db: PrismaClient,
	{ description, name }: ProjectProps,
) {
	const project = await db.projects.create({
		data: {
			name,
			description,
		},
	});

	return project;
}
