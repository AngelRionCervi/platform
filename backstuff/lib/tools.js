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


exports.getUpperDirAndName = getUpperDirAndName;
exports.getUpperDir = getUpperDir;