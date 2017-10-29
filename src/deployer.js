const { spawn } = require('./process');
const fs = require('fs-extra');

export default class Deployer {
    constructor(initializer, io, debug = false) {
        this.initializer = initializer;
        this.io = io;
        this.debug = debug;
    }

    deploy(fileSystem) {
        return this.initializer.assertInitialized(fileSystem).then(() => {
            this.io.comment('Starting the deployment...');

            return this.startDeployment(fileSystem).then(summary => {
                this.debug && this.io.write('Deployment is finished: '+JSON.stringify(summary));

                return summary;
            })
        })
    }

    startDeployment(fileSystem, tryResolveIssues = true) {
        let stdout = '';
        return spawn({cmd: 'serverless', args: ['deploy', '-v'], pipeStreams: this.debug, processCallback: (bashProcess) => {
            bashProcess.stdout.on('data', data => {
                stdout += data;

                if (data.indexOf('Serverless: Deploying Functions...') !== -1) {
                    this.io.comment('Compiled functions')
                } else if (data.indexOf('Serverless: Deployment successful!') !== -1) {
                    this.io.comment('Deployment successful!')
                }
            });
        }}).then(() => {
            this.debug && this.io.write('Deployment is finished, generating the summary.');

            return this.outputToDeploymentSummary(stdout);
        }, code => {
            if (tryResolveIssues && stdout.indexOf('Serverless plugin "serverless-openwhisk" not found.')) {
                this.debug && this.io.write('Serverless plugin "serverless-openwhisk" not found. Trying to install it.');

                return this.tryInstallServerLessDependencies(fileSystem).then(() => {
                    this.debug && this.io.write('Installed serverless dependencies.');

                    return this.startDeployment(fileSystem, false)
                })
            }

            return Promise.reject('Something went wrong while deploying the application')
        });
    }

    tryInstallServerLessDependencies(fileSystem) {
        this.io.comment('Installing missing local node dependencies with `npm`...');

        return spawn({cmd: 'npm', args: ['install', '-g', 'https://github.com/sroze/serverless-openwhisk#uses-only-sub-directory-for-php', 'serverless']}).then(() => {
            return spawn({cmd: 'npm', args: ['link', 'serverless-openwhisk']});
        });
    }

    outputToDeploymentSummary(stdout) {
        let summary = {
            functions: [],
            endpoints: [],
        };

        // Search for API-gateway endpoints
        let re = /\n([A-Z]+) ([a-z0-9:\/\.-]+) --> ([a-z0-9-]+)/g;
        let m;
        do {
            if (m = re.exec(stdout)) {
                summary.endpoints.push({
                    method: m[1],
                    url: m[2],
                    actionName: m[3]
                });
            }
        } while (m);

        let endpointByActionName = (endpoints, actionName) => {
            for (let i = 0; i < endpoints.length; i++) {
                if (endpoints[i].actionName == actionName) {
                    return endpoints[i];
                }
            }

            return null;
        };

        // Search for function
        re = /Compiled Function \(([a-z0-9-]+)\): (\{.+\})/g;
        do {
            if (m = re.exec(stdout)) {
                var functionConfiguration = JSON.parse(m[2]);

                summary.functions.push({
                    name: m[1],
                    actionName: functionConfiguration.actionName,
                    action: functionConfiguration.action,
                    endpoint: endpointByActionName(summary.endpoints, functionConfiguration.actionName)
                });
            }
        } while (m);

        return summary;
    }
}
