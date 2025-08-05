import { AppError } from "./_App-error";
import { ErrorTypes } from "./_ErrorTypes.enum";

export class ServerError extends AppError {
	constructor(message = "Unexpected Error occurred", details?: unknown) {
		super(message, 500, ErrorTypes.InternalServer, details);
	}
}
