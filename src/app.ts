import "reflect-metadata";

import { json, urlencoded } from "body-parser";
import * as express from "express";
import * as glob from "glob";
import { createServer } from "http";
import {
    useContainer as routingUseContainer,
    useExpressServer,
} from "routing-controllers";
import {
    useContainer as useContainerSocket,
    useSocketServer,
} from "socket-controllers";
import * as socketIo from "socket.io";
import { Container } from "typedi";
import {
    createConnection,
    getConnectionOptions,
    useContainer as ormUseContainer,
} from "typeorm";
import * as winston from "winston";

import { env } from "./env";
import { banner } from "./lib/banner";
import { Logger } from "./lib/logger";

/**
 * We create a new express server instance.
 */
const app = express();
// const exp = app;
const server = createServer(app);
const io = socketIo(server);

app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));

useExpressServer(app, {
    cors: {
        origin: "http://localhost:4200",
        credentials: true,
    },
    routePrefix: env.app.routePrefix,
    defaultErrorHandler: false,
    classTransformer: true,
    validation: true,
    controllers: [__dirname + "/api/controllers/*.ts"],
    // controllers: env.app.dirs.controllers,
    // middlewares: env.app.dirs.middlewares,
    middlewares: [__dirname + "/api/middlewares/*.ts"],
});
useSocketServer(io, {
    controllers: [__dirname + "/api/ws-controllers/*.ts"],
});

winston.configure({
    transports: [
        new winston.transports.Console({
            level: env.log.level,
            handleExceptions: true,
            json: env.log.json,
            timestamp: env.node !== "development",
            colorize: env.node === "development",
        }),
    ],
});

routingUseContainer(Container);
ormUseContainer(Container);
useContainerSocket(Container);

env.app.dirs.subscribers.forEach(pattern => {
    glob(pattern, (err: any, files: Array<string>) => {
        for (const file of files) {
            require(file);
        }
    });
});

const initTypeORM = async () => {
    const loadedConnectionOptions = await getConnectionOptions();

    const connectionOptions = Object.assign(loadedConnectionOptions, {
        type: env.db.type as any, // See createConnection options for valid types
        host: env.db.host,
        port: env.db.port,
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
        synchronize: env.db.synchronize,
        logging: env.db.logging,
        entities: env.app.dirs.entities,
        migrations: env.app.dirs.migrations,
    });

    return createConnection(connectionOptions);
};

app.get(env.app.routePrefix, (req: express.Request, res: express.Response) => {
    return res.json({
        name: env.app.name,
        version: env.app.version,
        description: env.app.description,
    });
});

const log = new Logger(__filename);

initTypeORM()
    .then(connection => {
        server.listen(env.app.port);
        banner(log);
    })
    .catch(error => log.error(`Application is crashed: ${error}`));
