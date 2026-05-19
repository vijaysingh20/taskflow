
import { config } from "@/config";
import pino from "pino";

export const logger = pino({
    level: config.NODE_ENV === "production" ? "info" : "debug",
    ...(config.NODE_ENV !== "production" && { transport: { target: "pino-pretty" } }),  
})