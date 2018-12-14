import * as dotenv from "dotenv-safe";
import * as path from "path";

import { getOsEnvArray, normalizePort, toBool } from "./lib/env";

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
    path: path.join(
        process.cwd(),
        `.env${process.env.NODE_ENV === "test" ? ".test" : ""}`,
    ),
    allowEmptyValues: true,
});

/**
 * Environment variables
 */
// TODO: After TS update to 2.9 we can safely use import statement, until then this is the most easies way to use json
/* tslint:disable-next-line:no-var-requires */
const pkg = require("./../package.json");

export const env = {
    node: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
    isDevelopment: process.env.NODE_ENV === "development",
    app: {
        name: process.env.APP_NAME,
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: process.env.APP_HOST,
        schema: process.env.APP_SCHEMA,
        routePrefix: process.env.APP_ROUTE_PREFIX,
        port: normalizePort(process.env.PORT || process.env.APP_PORT),
        banner: toBool(process.env.APP_BANNER),
        dirs: {
            migrations: (getOsEnvArray("TYPEORM_MIGRATIONS") || [
                path.relative(
                    path.join(process.cwd()),
                    path.join(__dirname, "database/migrations/**/*.ts"),
                ),
            ]) as Array<string>,
            migrationsDir:
                process.env.TYPEORM_MIGRATIONS_DIR ||
                path.relative(
                    path.join(process.cwd()),
                    path.join(__dirname, "database/migrations"),
                ),
            entities: (getOsEnvArray("TYPEORM_ENTITIES") || [
                path.relative(
                    path.join(process.cwd()),
                    path.join(__dirname, "api/models/**/*{.js,.ts}"),
                ),
            ]) as Array<string>,
            subscribers: (getOsEnvArray("TYPEORM_SUBSCRIBERS") || [
                path.join(__dirname, "api/subscribers/**/*subscriber{.js,.ts}"),
            ]) as Array<string>,
            controllers: (getOsEnvArray("CONTROLLERS") || [
                path.join(__dirname, "api/controllers/**/*controller{.js,.ts}"),
            ]) as Array<string>,
            middlewares: (getOsEnvArray("MIDDLEWARES") || [
                path.join(__dirname, "api/middlewares/**/*middleware{.js,.ts}"),
            ]) as Array<string>,
        },
        secretKey: process.env.SECRET_KEY,
    },
    log: {
        level: process.env.LOG_LEVEL,
        json: toBool(process.env.LOG_JSON),
        output: process.env.LOG_OUTPUT,
    },
    db: {
        type: process.env.TYPEORM_CONNECTION,
        host: process.env.TYPEORM_HOST,
        port: Number(process.env.TYPEORM_PORT),
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: toBool(process.env.TYPEORM_SYNCHRONIZE),
        logging: toBool(process.env.TYPEORM_LOGGING),
    },
    monitor: {
        route: process.env.MONITOR_ROUTE,
        username: process.env.MONITOR_USERNAME,
        password: process.env.MONITOR_PASSWORD,
    },
};
