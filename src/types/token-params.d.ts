import "@fastify/jwt";

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: { id: string }; // payload usado no sign()
		user: { id: string }; // payload retornado no jwtVerify()
	}
}
