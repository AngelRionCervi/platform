Object.filter = function (obj, predicate) {
    let result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};

export function propsRemover(object, props = []) {
    return Object.keys(object)
        .filter(key => !props.includes(key))
        .reduce((obj, key) => {
            obj[key] = object[key];
            return obj;
        }, {});
}

export function roundToPrevMult(n, mult) {
    return Math.ceil((n - mult) / mult) * mult;
}

