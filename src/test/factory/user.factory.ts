export function createUserFactory(overrides = {}) {
	return {
		id: "valid-user-id",
		username: "jhoe doe",
		email: "doit@mail.com",
		password: "pass1",

		...overrides,
	};
}
