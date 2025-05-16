import z from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().nonempty(),
	HASH_SALT: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);
