import * as express from "express";
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from "routing-controllers";

import { Logger, LoggerInterface } from "../../decorators/logger";
import { env } from "../../env";

@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    public isProduction = env.isProduction;

    constructor(@Logger(__filename) private log: LoggerInterface) {
    }

    public error(error: HttpError | any, req: express.Request, res: express.Response, next: express.NextFunction): void {
        const { httpCode = 500, name, message, stack, errors = [] } = error;

        res.status(httpCode)
            .json({
                name,
                message,
                errors,
            });

        if (this.isProduction) {
            this.log.error(name, message);
        } else {
            this.log.error(name, stack);
        }
    }
}
