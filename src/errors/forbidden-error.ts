import { AppError } from "./_App-error";
import { ErrorTypes } from "./_ErrorTypes.enum";

export class ForbiddenError extends AppError {
	constructor(message = "Forbidden", details?: undefined) {
		super(message, 403, ErrorTypes.Forbidden, details);
	}
}
