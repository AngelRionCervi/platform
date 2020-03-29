function getUpperDirAndName(fullPath) {
    let upperFoldAndName = fullPath.split('/').slice(-2).join('/');
    if (upperFoldAndName.charAt(0) !== '/') {
        upperFoldAndName = '/' + upperFoldAndName;
    }
    return upperFoldAndName;
}

exports.getUpperDirAndName = getUpperDirAndName;