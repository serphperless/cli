export default class Initializer {
    constructor(io) {
        this.io = io;
    }

    assertInitialized(fileSystem) {
        return this.assertServerLessInitialized(fileSystem).then(() => {
            return this.assertApplicationSupportsDeployment(fileSystem).then(() => {
                return this.assertSymfonyApplicationSupportsDeployment(fileSystem)
            })
        })
    }

    assertServerLessInitialized(fileSystem) {
        return fileSystem.fileExists('serverless.yaml').then((serverLessExists) => {
            if (!serverLessExists) {
                return Promise.reject('No "serverless" configuration');
            }
        }).catch(err => {
            this.io.title('Welcome!');
            this.io.text('It looks like your application is not configured.');

            return this.io.confirm('Do you want me to configure it for you?').then(confirm => {
                if (!confirm) {
                    return Promise.reject('Can\'t perform your action without an initialized application.');
                }

                return this.io.ask('Give a name to your application', fileSystem.directoryName()).then(name => {
                    return fileSystem.file('serverless.yaml').write(
                        'service: '+name+'\n' +
                        '\n' +
                        'provider:\n' +
                        '  name: openwhisk\n' +
                        '  runtime: php\n' +
                        '\n' +
                        'package:\n' +
                        '  individually: true\n' +
                        '\n' +
                        'functions:\n' +
                        '  '+name+':\n' +
                        '    handler: index.main\n' +
                        '    events:\n' +
                        '      - http:\n' +
                        '          method: GET\n' +
                        '          path: /\n' +
                        '          resp: http' +
                        '\n' +
                        'plugins:\n' +
                        '  - serverless-openwhisk\n'
                    ).then(() => {
                        this.io.success('Application successfully configured as function')
                    })
                })
            });
        })
    }

    assertApplicationSupportsDeployment(fileSystem) {
        return this.guessApplicationType(fileSystem).then((type) => {
            if (type !== 'symfony') {
                return Promise.reject(`Application type "${type}" is not supported`)
            }
        })
    }

    assertSymfonyApplicationSupportsDeployment(fileSystem) {
        return this.assertComposerHasTheDependency(fileSystem.file('composer.json'), 'sroze/openwhisk-bundle')
            .catch(() => {
                return this.io.confirm('Your Symfony application requires the \`sroze/openwhisk-bundle\` dependency. Do you want me to add it for you?').then(confirm => {
                    if (!confirm) {
                        return Promise.reject('Your Symfony application will not work without the openwhisk compatibility.');
                    }

                    const { spawn } = require('./process');
                    const cmd =
                        'composer config extra.symfony.allow-contrib true' +
                        '&& export SYMFONY_ENDPOINT=https://symfony.sh/r/github.com/symfony/recipes-contrib/124' +
                        '&& composer req "sroze/openwhisk-bundle:^0.2"'
                    ;

                    return spawn({cmd: 'bash', args: ['-c', cmd]}).catch(() => {
                        return Promise.reject('Could not install the \`sroze/openwhisk-bundle\` dependency');
                    });
                })
            });
    }

    guessApplicationType(fileSystem) {
        return fileSystem.fileExists('composer.json').then((composerFileExists) => {
            if (!composerFileExists) {
                return Promise.reject('No "composer.json" file found; could not guess the application');
            }

            return this.assertComposerHasTheDependency(fileSystem.file('composer.json'), 'symfony/flex').then(() => {
                return 'symfony';
            })
        })
    }

    assertComposerHasTheDependency(file, dependency) {
        return file.json().then(json => {
            if (json && json.require && json.require[dependency]) {
                return true;
            }

            return Promise.reject(`Dependency "${dependency}" was not found`);
        })
    }
}
