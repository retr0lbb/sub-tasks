import type z from "zod";
import { InputError } from "../errors/input-error";

export function parseSchema<T extends z.ZodRawShape>(
	schema: z.ZodObject<T>,
	data: unknown,
) {
	const parsedSchema = schema.safeParse(data);
	if (!parsedSchema.success) {
		console.log(schema._type);
		throw new InputError(parsedSchema.error.errors);
	}

	return parsedSchema.data;
}
