export function createTaskFactory(overrides = {}) {
	return {
		id: "valid-user-id",
		title: "task-title",
		description: "task-description",
		createdAt: new Date(),
		updatedAt: null,
		isCompleted: false,

		parentId: null,
		projectId: "valid project id",
		...overrides,
	};
}
