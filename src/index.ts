import { config } from "@/config";
import { logger } from "@/shared/utils/logger";
import app from "./app";

const PORT = config.PORT;

app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server started')
})