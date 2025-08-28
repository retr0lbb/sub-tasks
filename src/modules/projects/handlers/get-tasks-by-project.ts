import { ClientError } from "../../../errors/client-error";
import type { PrismaClient } from "@prisma/client";
import { recursiveGetSubtasks } from "../../../utils/iterate-over-subtasks";
import type {
	GetTasksByProjectParams,
	GetTasksByProjectQuery,
} from "../dtos/get-tasks-by-project.dto";
import type { RequestUser } from "../../../utils/request-user.type";

export async function getAllTasksByProject(
	data: GetTasksByProjectParams & RequestUser,
	options: GetTasksByProjectQuery,
	db: PrismaClient,
) {
	const project = await db.projects.findUnique({
		where: {
			id: data.projectId,
		},
	});

	if (!project) {
		throw new ClientError("Project not found");
	}

	const user = await db.users.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user) {
		throw new ClientError("User not found");
	}

	if (project.userId !== user.id) {
		throw new ClientError("User is not the owner of the project");
	}

	const topLevelTasks = await db.tasks.findMany({
		where: {
			projectId: data.projectId,
			parentId: null,
		},
		omit: {
			projectId: true,
		},
		take: options.per_page,
		skip:
			options.page && options.per_page && (options.page - 1) * options.per_page,
		orderBy: {
			createdAt: options.order,
		},
	});

	if (topLevelTasks.length === 0) {
		return [];
	}

	const allTasks = await Promise.all(
		topLevelTasks.map(async (task) => {
			return await recursiveGetSubtasks(
				db,
				task,
				options.max_recursion_depth ?? 10_000,
			);
		}),
	);
	return allTasks;
}
