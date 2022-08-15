'use strict';

/**
 * Create object that represents folder and return it.
 *
 * File access is limited to certain virtual directories.
 * These directories are a subset of those accessible through WebDAV.
 * As a result of this restriction, pathnames must be one of the following forms:
 *
 * * /TEMP(/...)
 * * /IMPEX(/...)
 * * /REALMDATA(/...)
 * * /CATALOGS/[Catalog Name](/...)
 * * /LIBRARIES/[Library Name](/...)
 * @param {string} folderPath Path where folder should be located
 * @returns {dw.io.File} Created folder object
 */
function createFolder(folderPath) {
    var File = require('dw/io/File');
    var folder = new File(folderPath);

    if (!folder.exists()) {
        folder.mkdirs();
    }

    return folder;
}

/**
 * Create an file in the existed folder and return the object that represent it
 * @param {string} path Path where file should be located
 * @returns {dw.io.File} Created file object
 * @throws {Error} throws an error if failed to create file or directory not exist
 */
function createFile(path) {
    var File = require('dw/io/File');
    var file = new File(path);

    if (!file.createNewFile()) {
        throw new Error('Failed to create file. Maybe file directory not exist. Check out the path ' + path);
    }

    return file;
}

/**
 * Write some text in the file.
 * @param {dw.io.File} file file where the writing of the text goes
 * @param {string} text The text to write in file
 */
function writeFile(file, text) {
    var FileWriter = require('dw/io/FileWriter');
    var fileStream = new FileWriter(file);

    fileStream.writeLine(text);
    //! Release resources
    fileStream.close();
}

/**
 * Move files from source to destination folder
 * @param {string} srcDirPath source directory path
 * @param {string} dstDirPath destination directory path
 * @throws {Error} throws an error if source directory not exist or empty
 */
function moveFiles(srcDirPath, dstDirPath) {
    var File = require('dw/io/File');
    var StringUtils = require('dw/util/StringUtils');

    // create folder obj
    var srcFolder = new File(srcDirPath);
    var srcFilesIterator = srcFolder.listFiles().iterator();
    var destFolder = new File(dstDirPath);
    var destFile = null;
    var destFilePath = '';
    var isEmpty = true;

    if (!srcFolder.exists()) {
        throw new Error('Source directory not exist');
    }

    // mkdirs for store
    if (!destFolder.exists()) {
        destFolder.mkdirs();
    }

    while (srcFilesIterator.hasNext()) {
        var srcFileItem = srcFilesIterator.next();

        if (srcFileItem.isFile()) {
            isEmpty = false;
            // create dest file
            destFilePath = StringUtils.format('{0}/{1}', dstDirPath, srcFileItem.getName());
            destFile = new File(destFilePath);
            // copy to dest file
            srcFileItem.copyTo(destFile);
            // delete src file
            srcFileItem.remove();
        }
    }

    if (isEmpty) {
        throw new Error('Source directory is empty');
    }
}

/**
 * Create file with some text inside (doesn't matter what text)
 * inside IMPEX/task_1/process folder. The filename  passed as
 * a parameter of this job step. The result of this job step should
 * be a file with unique name (unique name can be achieved via
 * adding of a random numbers in the end of the file name, for
 * ex.: file_123, file_124, etc.).
 * @param {Object} parameters Represents the parameters defined in the steptypes.json file
 */
function processFile(parameters) {
    var File = require('dw/io/File');
    var StringUtils = require('dw/util/StringUtils');

    var dateNow = new Date();
    var dateSuffix = dateNow.toLocaleString();
    var folderPath = StringUtils.format('/{0}/task_1/process', File.IMPEX);
    var fullFileName = StringUtils.format('{0}_{1}.txt', parameters.fileName, dateSuffix);
    var filePath = folderPath + '/' + fullFileName;
    var text = '---- ' + dateSuffix + ' -----------\n';
    text += 'Hello World!\n';
    text += '~Some sample file message text.';

    createFolder(folderPath);
    var file = createFile(filePath);
    writeFile(file, text);
}

/**
 * Remove folder "IMPEX/task_1/" from IMPEX. Warns if fail.
 * @returns {dw.system.Status} Status which job step have finished with
 */
function removeAllFiles() {
    // TODO - General recursive removal script custom.FileIODelete
    var File = require('dw/io/File');
    var StringUtils = require('dw/util/StringUtils');
    var Status = require('dw/system/Status');

    var folderPath = StringUtils.format('/{0}/task_1', File.IMPEX);
    var folder = new File(folderPath);
    var subFolder = new File(folderPath + '/process'); //! change to '/store' to delete store dir
    var filesIterator = subFolder.listFiles().iterator();
    var isRemovedItem = true;

    while (filesIterator.hasNext()) {
        var fileItem = filesIterator.next();
        isRemovedItem = fileItem.remove() && isRemovedItem;
    }

    var isRemovedSubFolder = subFolder.remove();
    var isRemovedFolder = folder.remove();
    var statusCode = 'ERROR';
    var message = 'Some message';
    var Logger = require('dw/system/Logger');
    var fileIOLog = Logger.getLogger('io-job-step', 'file_io');

    if (!isRemovedItem) {
        statusCode = 'DIR_NOT_EMPTY';
        message = 'Some subdirs from "IMPEX/task_1/process" haven\'t removed because it\'s not empty.';
        fileIOLog.warn(message);
        return new Status(Status.OK, statusCode, message);
    }

    if (!isRemovedSubFolder) {
        statusCode = 'DIR_NOT_EMPTY';
        message = '"IMPEX/task_1/process" directory haven\'t removed because it\'s not empty.';
        fileIOLog.warn(message);
        return new Status(Status.OK, statusCode, message);
    }

    if (!isRemovedFolder) {
        statusCode = 'DIR_NOT_EMPTY';
        message = '"IMPEX/task_1" directory haven\'t removed because it\'s not empty.';
        fileIOLog.warn(message);
        return new Status(Status.OK, statusCode, message);
    }

    return new Status(Status.OK);
}

/**
 * COPY files from IMPEX/task_1/process to IMPEX/task_1/store and remove source files.
 * COPY IMPEX/task_1/process -> IMPEX/task_1/store (& Delete)
 */
function exportAllFiles() {
    // COPY IMPEX/task_1/process -> IMPEX/task_1/store (& Delete)
    var File = require('dw/io/File');
    var StringUtils = require('dw/util/StringUtils');
    var srcPath = StringUtils.format('/{0}/task_1/process', File.IMPEX);
    var destFolderPath = StringUtils.format('/{0}/task_1/store', File.IMPEX);

    moveFiles(srcPath, destFolderPath);
}

module.exports = {
    processFile: processFile,
    removeAllFiles: removeAllFiles,
    exportAllFiles: exportAllFiles
};
