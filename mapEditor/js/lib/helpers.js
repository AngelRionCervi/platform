Object.filter = function (obj, predicate) {
    let result = {},
        key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};

Array.prototype.removeAt = function (from, to) {
    this.splice(from, to);
    return this;
};

String.prototype.removeAt = function (from, to) {
    this.substring(from, to);
    return this;
};

String.prototype.indexesOf = function (str) {
    const result = [];

    if (!str) {
        return this.split("").map((_, i) => i);
    }

    for (let i = 0; i < this.length; ++i) {
        if (this.substring(i, i + str.length) == str) {
            result.push(i);
        }
    }

    return result;
};

CanvasRenderingContext2D.prototype.clear = 
  CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
    if (preserveTransform) {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (preserveTransform) {
      this.restore();
    }           
};

export function propsRemover(object, props = []) {
    return Object.keys(object)
        .filter((key) => !props.includes(key))
        .reduce((obj, key) => {
            obj[key] = object[key];
            return obj;
        }, {});
}

export function roundToPrevMult(n, mult) {
    return Math.ceil((n - mult) / mult) * mult;
}

export function uniqid() {
    return "_" + Math.random().toString(36).substr(2, 9);
}

export function precise(number, precision) {
    return Number.parseFloat(number).toPrecision(precision);
}

export function spy(obj, methods, callback) {
    const meths = [methods].flat();
    const Spy = {
        args: [],
        count: 0,
    };

    for (const meth of meths) {
        const original = obj[meth];
        obj[meth] = function () {
            let args = [].slice.apply(arguments);
            if (Spy.args.length >= 50) Spy.args.pop();
            Spy.count++;
            Spy.args.unshift(args);
            original.call(obj, ...args);
            callback(...args);
        };
    }

    return Spy;
}
