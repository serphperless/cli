const child_process = require('child_process');

export function spawn ({
    cmd,
    args,
    processCallback = null,
    pipeStreams = true
}) {
    return new Promise((resolve, reject) => {
        const bashProcess = child_process.spawn(cmd, args);

        if (processCallback) {
            processCallback(bashProcess);
        }

        if (pipeStreams) {
            bashProcess.stdout.pipe(process.stdout);
            bashProcess.stderr.pipe(process.stderr);
        }

        bashProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(code)
            }
        });
    })
}
