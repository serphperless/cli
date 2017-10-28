#!/usr/bin/env node

const program = require('commander');
const debug = require('debug');
const { SymfonyStyle } = require('symfony-style-console')
const io = new SymfonyStyle();

import Deployer from '../src/deployer.js';
import Initializer from '../src/initializer.js';
import Filesystem from '../src/filesystem.js';


// https://github.com/tj/commander.js/

const main = async (argv_) => {
    program
        .version('0.1.0')
    ;

    program
        .command('deploy')
        .description('Deploy your application')
        .action(function(options){
            let d = new Deployer(
                new Initializer(io),
                io
            );

            d.deploy(new Filesystem(process.cwd())).then(() => {
                console.log('DEPLOYED !')
            });
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