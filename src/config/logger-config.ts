// src/configs/logger.config.ts
import pino from "pino";

// Cria destino do arquivo
const logDestination = pino.destination("./logs/logs.log");

export const LoggerConfig = {
	level: "info",
	stream: logDestination,
};
