const fs = require('fs');
const { promisify } = require('util');
const shortid = require('shortid');
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const writeFileAsync = promisify(fs.writeFile);
const statAsync = promisify(fs.stat);


function getUpperDirAndName(fullPath) {
    let upperFoldAndName = fullPath.split('/').slice(-2).join('/');
    if (upperFoldAndName.charAt(0) !== '/') {
        upperFoldAndName = '/' + upperFoldAndName;
    }
    return upperFoldAndName;
}

function getUpperDir(fullPath) {
    const upperFoldAndName = getUpperDirAndName(fullPath);
    const upperFold = '/' + upperFoldAndName.substring(1).split('/').shift();

    if (upperFold.includes('.')) { // not a folder but a file
        return '';
    }

    return upperFold;
}


async function getDirContent(dir, recFileObjs = []) {

    const fileObjs = recFileObjs;
    const files = await readdirAsync(dir);

    for (const file of files) {

        const fileObj = { name: '', path: '' };
        const stat = await statAsync(dir + '/' + file);

        if (stat.isFile()) {
            fileObj.path = (dir + '/' + file).substring(1);
            fileObj.name = file;
            fileObjs.push(fileObj);
        }
        else {
            await getDirContent(dir + '/' + file, fileObjs);
        }
    }

    return fileObjs;
}

function idfy(arr) {
    arr.forEach((v) => {
        v.id = shortid.generate();
    });
    return arr;
}


exports.getUpperDirAndName = getUpperDirAndName;
exports.getUpperDir = getUpperDir;
exports.getDirContent = getDirContent;
exports.idfy = idfy;