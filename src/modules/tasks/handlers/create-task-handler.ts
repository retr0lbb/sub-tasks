import type { PrismaClient } from "@prisma/client";
import { ClientError } from "../../../errors/client-error";
import { requestUser } from "../../../utils/request-user.type";

interface CreateTaskParams {
	userId: string;
	title: string;
	description?: string;
	parentId?: string | null;
	projectId: string;
}

export async function createTask(db: PrismaClient, data: CreateTaskParams) {
	if (!data.userId) {
		throw new ClientError("You must be register to it");
	}
	const user = await db.users.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user) {
		throw new Error("User not found in our database");
	}
	try {
		if (data.parentId) {
			const parentTask = await db.tasks.findUnique({
				where: {
					id: data.parentId,
				},
			});

			if (parentTask === null) {
				throw new ClientError("Parent task not found");
			}
		}

		const project = await db.projects.findUnique({
			where: {
				id: data.projectId,
			},
		});

		if (project === null) {
			throw new ClientError("couldn't find project");
		}

		const result = await db.tasks.create({
			data: {
				title: data.title,
				description: data.description,
				parentId: data.parentId,
				projectIdId: data.projectId,
				userId: data.userId,
			},
		});

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
