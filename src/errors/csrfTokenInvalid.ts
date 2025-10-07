import { AppError } from "./_App-error";
import { ErrorTypes } from "./_ErrorTypes.enum";

export class CSRFTokenInvalid extends AppError {
	constructor(message = "Invalid or expired CSRF token", details?: undefined) {
		super(message, 403, ErrorTypes.Forbidden, details);
	}
}
