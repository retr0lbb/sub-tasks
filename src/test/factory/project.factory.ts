export function createProjectFactory(overrides = {}) {
	return {
		id: "valid-project-id",
		name: "project-name",
		description: "project-description",
		userId: "valid-user-id",

		...overrides,
	};
}
