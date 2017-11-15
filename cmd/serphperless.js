#!/usr/bin/env node

const program = require('commander');
const debug = require('debug');
const { SymfonyStyle } = require('symfony-style-console')
const io = new SymfonyStyle();

import Deployer from '../src/deployer.js';
import Initializer from '../src/initializer.js';
import Filesystem from '../src/filesystem.js';

const main = async (argv_) => {
    program
        .version('0.1.3')
        .option('-d, --debug', 'Enable the debug mode')
    ;

    program
        .command('deploy')
        .description('Deploy your application')
        .action(function(options){
            let d = new Deployer(
                new Initializer(io),
                io,
                program.debug
            );

            d.deploy(new Filesystem(process.cwd())).then(summary => {
                summary.functions.forEach(func => {
                    io.section(func.name)

                    if (func.endpoint) {
                        io.write([
                            `    Method: ${func.endpoint.method}`,
                            `    URL: ${func.endpoint.url}`,
                            ''
                        ], true)
                    }
                });
            }).catch(handleRejection);
        });

    program.parse(process.argv);

    if (program.args.length === 0) {
        program.help();
    }
};

const handleRejection = err => {
    debug('handling rejection');
    if (err) {
        if (err instanceof Error) {
            handleUnexpected(err)
        } else {
            io.error(err)
        }
    } else {
        io.error('An unexpected empty rejection occurred')
    }
    process.exit(1)
};

const handleUnexpected = err => {
    debug('handling unexpected error')
    io.error(
        `An unexpected error occurred!\n  ${err.stack} ${err.stack}`
    );
    process.exit(1)
};

process.on('unhandledRejection', handleRejection)
process.on('uncaughtException', handleUnexpected)

main(process.argv).catch(handleUnexpected)
