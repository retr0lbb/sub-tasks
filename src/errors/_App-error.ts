import { ErrorTypes } from "./_ErrorTypes.enum";

export class AppError extends Error {
	constructor(
		public readonly message: string,
		public readonly statusCode: number,
		public readonly type: ErrorTypes = ErrorTypes.InternalServer,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = type;
		Error.captureStackTrace(this, this.constructor);
	}
}
