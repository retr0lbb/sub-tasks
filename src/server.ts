import { app } from "./app";

app
	.listen({
		port: 3333,
	})
	.then(() => {
		app.log.info("Server started on http://localhost:3333");
		console.log("server Running");
	});

/**
 * ============ Hy There ============
 * |  This project is made          |
 * |  with love by retr0lbb. HBS    |
 * |								|
 * |   please consider becoming a   |
 * |   FURRY UwU. I mean. A         |
 * |   Software Developer           |
 * ==================================
 */
