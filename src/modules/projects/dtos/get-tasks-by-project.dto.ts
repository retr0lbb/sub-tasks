import z from "zod/v4";
import type { TaskWithSubtasks } from "../../../utils/iterate-over-subtasks";

export const getTasksByProjectParamsSchema = z.object({
	projectId: z.string().uuid(),
});

const TaskSchema = z.object({
	id: z.string().uuid(),
	description: z.string().nullable(),
	title: z.string(),
	createdAt: z.date(),
	updatedAt: z.date().nullable(),
	isCompleted: z.boolean(),
	parentId: z.uuid().nullable(),
});

const taskWithSubtask = TaskSchema.extend({
	subTasks: z.array(TaskSchema),
});

export const getTasksByProjectResponse = {
	200: z.object({
		data: z.array(taskWithSubtask),
	}),
};

export type GetTasksByProjectParams = z.infer<
	typeof getTasksByProjectParamsSchema
>;
