Object.filter = function (obj, predicate) {
    let result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};

Array.prototype.removeAt = function (index, to) {
    this.splice(index, to);
    return this;
}

String.prototype.indexesOf = function (str) {

    const result = [];
   
    if (!str) {
        return this.split('').map((_, i) => i);
    }
 
    for (let i = 0; i < this.length; ++i) {
        if (this.substring(i, i + str.length) == str) {
            result.push(i);
        }
    }
    
    return result;
}

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

