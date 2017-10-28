const fs = require('fs-extra');
const path = require('path');

class File {
    constructor(path) {
        this.path = path;
    }

    json() {
        return fs.readJson(this.path);
    }

    write(contents) {
        return fs.outputFile(this.path, contents)
    }
}

export default class Filesystem {
    constructor(directory) {
        this.directory = directory;
    }

    fileExists(name) {
        return fs.pathExists(this._filePath(name));
    }

    file(name) {
        return new File(this._filePath(name));
    }

    directoryName() {
        return this.directory.substr(this.directory.lastIndexOf(path.sep) + 1)
    }

    _filePath(name) {
        return this.directory+path.sep+name;
    }
}
