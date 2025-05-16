import "fastify";

declare module "fastify" {
	interface FastifyInstance {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		authenticate: any;
	}
}
