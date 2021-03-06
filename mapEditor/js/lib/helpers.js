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
    CanvasRenderingContext2D.prototype.clear ||
    function (preserveTransform) {
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

export function roundToNextMult2(n, mult) {
    if (n % mult === 0) return n;
    return Math.ceil(n / mult) * mult;
}

export function roundToPrevMult(n, mult) {
    if (n % mult === 0) return n;
    return Math.ceil((n - mult) / mult) * mult;
}

export function roundToNextMult(n, mult) {
    if (n % mult === 0) return n;
    return Math.floor((n - mult) / mult) * mult;
}

export function roundToNearestMult(n, mult) {
    if (n % mult === 0) return n;
    return Math.round(n / mult) * mult;
}

export function uniqid(start = "") {
    return start + "_" + Math.random().toString(36).substr(2, 9);
}

export function precise(number, precision) {
    return Number.parseFloat(number).toPrecision(precision);
}

export function roundTo(number, to) {
    return Math.round((number + Number.EPSILON) * 10 ** to) / 10 ** to;
}

export function posOr0(number) {
    return number > 0 ? number : 0;
}

export function spy(obj, methods, callback) {
    const meths = [methods].flat();
    const callbacks = [callback].flat();
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
            callbacks.forEach((cb) => cb(...args));
        };
    }

    return Spy;
}

export async function loadImages(imageSrcs) {
    return await Promise.all(
        imageSrcs.map(async (src) => {
            return new Promise((resolve) => {
                const buffer = document.createElement("canvas");
                const image = new Image();
                image.src = src;
                image.addEventListener("load", (evt) => {
                    buffer.width = image.naturalWidth;
                    buffer.height = image.naturalHeight;
                    buffer.getContext("2d").drawImage(image, 0, 0);
                    resolve({
                        sprite: buffer,
                        b64: getDataUrl(evt.currentTarget),
                        width: buffer.width,
                        height: buffer.height,
                    });
                });
            });
        })
    );
}
