import { AppError } from "./_App-error";
import { ErrorTypes } from "./_ErrorTypes.enum";

export class Unauthorized extends AppError {
	constructor(message = "Unauthorized", details?: unknown) {
		super(message, 401, ErrorTypes.Unauthorized, details);
	}
}
