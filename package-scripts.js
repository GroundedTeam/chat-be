const { series, rimraf } = require('nps-utils');

module.exports = {
    scripts: {
        default: 'nps start',
        /**
         * Starts the builded app from the dist directory
         */
        start: {
            script: 'node dist/app.js',
            description: 'Starts the builded app from the dist directory',
        },
        /**
         * Serves the current app and watches for changes to restart it
         */
        serve: {
            script: 'nodemon --watch src --watch .env',
            description: 'Serves the current app and watches for changes to restart it',
        },
        /**
         * Setup of the development environment
         */
        setup: {
            script: series(
                'yarn install',
                'nps db.drop',
                'nps db.migrate',
                'nps db.seed',
            ),
            description: 'Setup`s the development environment(yarn & database)',
        },
        /**
         * Builds the app into the dist directory
         */
        build: {
            script: series(
                'nps lint',
                'nps clean.dist',
                'nps transpile',
            ),
            description: 'Builds the app into the dist directory',
        },
        /**
         * Runs TSLint over your project
         */
        lint: {
            script: tslint(`./src/**/*.ts`),
            hiddenFromHelp: true,
        },
        /**
         * Transpile your app into javascript
         */
        transpile: {
            script: `tsc --project ./tsconfig.json`,
            hiddenFromHelp: true,
        },
        /**
         * Clean files and folders
         */
        clean: {
            default: {
                script: 'nps clean.dist',
                description: 'Deletes the ./dist folder',
            },
            dist: {
                script: rimraf('./dist'),
                hiddenFromHelp: true,
            },
        },
        /**
         * Database scripts
         */
        db: {
            migrate: {
                script: runFast('./node_modules/typeorm/cli.js migration:run'),
                description: 'Migrates the database to newest version available',
            },
            revert: {
                script: runFast('./node_modules/typeorm/cli.js migration:revert'),
                description: 'Downgrades the database',
            },
            seed: {
                script: runFast('./src/lib/seed/cli.ts'),
                description: 'Seeds generated records into the database',
            },
            drop: {
                script: runFast('./node_modules/typeorm/cli.js schema:drop'),
                description: 'Drops the schema of the database',
            },

        },
    },
};


function runFast(path) {
    return `ts-node --transpileOnly ${path}`;
}

function tslint(path) {
    return `tslint -c ./tslint.json ${path} --format stylish`;
}
