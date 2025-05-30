import z from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().nonempty(),
	HASH_SALT: z.string().nonempty(),
	JWT_TOKEN_SECRET: z.string().nonempty(),
	COOKIE_SECRET: z.string(),
	COOKIE_PREFIX: z.string(),
});

export const env = envSchema.parse(process.env);
