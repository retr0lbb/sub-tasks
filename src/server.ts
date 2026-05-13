import { app } from "./app";
import { env } from "./utils/env";

app
	.listen({
		port: Number(env.PORT) || 3000,
		host: "0.0.0.0",
	})
	.then(() => {
		app.log.info(`Server started on http://localhost:${env.PORT}`);
		console.log("server Running");
	})
	.catch((err) => {
		console.log(err);
	});
