import type { FastifyReply } from "fastify";
import { env } from "./env";

export async function createCookie(props: {
	reply: FastifyReply;
	cookieName: string;
	cookie: string;
	ExpirationInSeconds?: number;
}) {
	props.reply.setCookie(
		`${env.COOKIE_PREFIX}:${props.cookieName}`,
		props.cookie,
		{
			path: "/",
			httpOnly: true,
			sameSite: "none",
			secure: false,
			maxAge: props.ExpirationInSeconds ?? 60 * 60 * 24, // A day or something
		},
	);
}
