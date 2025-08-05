import { AppError } from "./_App-error";
import { ErrorTypes } from "./_ErrorTypes.enum";

export class NotFoundError extends AppError {
	constructor(message = "Resource not found", details?: unknown) {
		super(message, 404, ErrorTypes.NotFound, details);
	}
}
