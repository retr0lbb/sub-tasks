import { AppError } from "./_App-error";
import { ErrorTypes } from "./_ErrorTypes.enum";

export class ClientError extends AppError {
	constructor(message = "Bad Request", details?: unknown) {
		super(message, 400, ErrorTypes.BadRequest, details);
	}
}
