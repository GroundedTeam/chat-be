import * as express from "express";
// import * as monitor from "express-status-monitor";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

// import { env } from "../../env";

@Middleware({ type: "before" })
export class MonitorMiddleware implements ExpressMiddlewareInterface {
    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        // return monitor({
        //     title: env.app.name,
        //     path: env.monitor.route,
        //     chartVisibility: {
        //         cpu: true,
        //         mem: true,
        //         load: true,
        //         responseTime: true,
        //         rps: true,
        //         statusCodes: true,
        //     },
        // })(req, res, next);
        next();
    }
}
