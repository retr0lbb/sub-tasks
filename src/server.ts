import { app } from "./app";

app
	.listen({
		port: 3333,
	})
	.then(() => {
		app.log.info("Server started on http://localhost:3333");
		console.log("server Running");
	});
