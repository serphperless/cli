const { spawn } = require('./process');

export default class Deployer {
    constructor(initializer, io) {
        this.initializer = initializer;
        this.io = io;
    }

    deploy(fileSystem) {
        return this.initializer.assertInitialized(fileSystem).then(() => {
            console.log('Starting the deployment');

            return this.startDeployment(fileSystem);
        })
    }

    startDeployment(fileSystem, tryResolveIssues = true) {
        return new Promise((resolve, reject) => {
            let stdout = '';
            return spawn({cmd: 'serverless', args: ['deploy'], processCallback: (bashProcess) => {
                bashProcess.stdout.on('data', data => {
                    stdout += data;
                });
            }}).catch(code => {
                if (tryResolveIssues && stdout.indexOf('Serverless plugin "serverless-openwhisk" not found.')) {
                    return this.tryInstallServerLessDependencies(fileSystem).then(() => {
                        return this.startDeployment(fileSystem, false)
                    })
                }

                return Promise.reject('Something went wrong while deploying the application')
            });
        })
    }

    tryInstallServerLessDependencies(fileSystem) {
        this.io.comment('Installing missing local node dependencies with `npm`...');

        return spawn({cmd: 'npm', args: ['install', '-g', 'https://github.com/sroze/serverless-openwhisk#uses-only-sub-directory-for-php', 'serverless']}).then(() => {
            return spawn({cmd: 'npm', args: ['link', 'serverless-openwhisk']});
        });
    }
}
