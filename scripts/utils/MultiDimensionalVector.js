import { NumberRange, Numeric } from "./index"

export class MultiDimensionalVector {
    constructor(a, b, c) {
        if (MultiDimensionalVector.isVector2(a) && b === undefined && c === undefined) {
            Object.defineProperties(this, {
                x: {
                    value: a.x,
                    writable: true,
                    configurable: false,
                    enumerable: true
                },
                y: {
                    value: a.y,
                    writable: true,
                    configurable: false,
                    enumerable: true
                }
            });
            this.#internal.dimensionSize = 2;
        }
        else if (MultiDimensionalVector.isVector3(a) && b === undefined && c === undefined) {
            Object.defineProperties(this, {
                x: {
                    value: a.x,
                    writable: true,
                    configurable: false,
                    enumerable: true
                },
                y: {
                    value: a.y,
                    writable: true,
                    configurable: false,
                    enumerable: true
                },
                z: {
                    value: a.z,
                    writable: true,
                    configurable: false,
                    enumerable: true
                }
            });
            this.#internal.dimensionSize = 3;
        }
        else if (Array.isArray(a) && b === undefined && c === undefined) {
            if (a.some(element => !Numeric.isNumeric(element))) {
                throw new Error(`引数が正しくありません: ${a} ${b} ${c}`);
            }

            Object.defineProperties(this, {
                x: {
                    value: a[0],
                    writable: true,
                    configurable: false,
                    enumerable: true
                },
                y: {
                    value: a[1],
                    writable: true,
                    configurable: false,
                    enumerable: true
                }
            });

            if (a[2] === undefined) {
                this.#internal.dimensionSize = 2;
            }
            else {
                Object.defineProperty(this, "z", {
                    value: a[2],
                    writable: true,
                    configurable: false,
                    enumerable: true
                });
                this.#internal.dimensionSize = 3;
            }
        }
        else if (Numeric.isNumeric(a) && b === undefined && c === undefined) {
            if (a === 2) {
                Object.defineProperties(this, {
                    x: {
                        value: 0,
                        writable: true,
                        configurable: false,
                        enumerable: true
                    },
                    y: {
                        value: 0,
                        writable: true,
                        configurable: false,
                        enumerable: true
                    }
                });
                this.#internal.dimensionSize = 2;
            }
            else if (a === 3) {
                Object.defineProperties(this, {
                    x: {
                        value: 0,
                        writable: true,
                        configurable: false,
                        enumerable: true
                    },
                    y: {
                        value: 0,
                        writable: true,
                        configurable: false,
                        enumerable: true
                    },
                    z: {
                        value: 0,
                        writable: true,
                        configurable: false,
                        enumerable: true
                    }
                });
                this.#internal.dimensionSize = 3;
            }
            else throw new RangeError("その次元のベクトルは作成できません");
        }
        else if (Numeric.isNumeric(a) && Numeric.isNumeric(b) && c === undefined) {
            Object.defineProperties(this, {
                x: {
                    value: a,
                    writable: true,
                    configurable: false,
                    enumerable: true
                },
                y: {
                    value: b,
                    writable: true,
                    configurable: false,
                    enumerable: true
                }
            });
            this.#internal.dimensionSize = 2;
        }
        else if (Numeric.isNumeric(a) && Numeric.isNumeric(b) && Numeric.isNumeric(c)) {
            Object.defineProperties(this, {
                x: {
                    value: a,
                    writable: true,
                    configurable: false,
                    enumerable: true
                },
                y: {
                    value: b,
                    writable: true,
                    configurable: false,
                    enumerable: true
                },
                z: {
                    value: c,
                    writable: true,
                    configurable: false,
                    enumerable: true
                }
            });
            this.#internal.dimensionSize = 3;
        }
        else throw new Error(`引数が正しくありません: ${a} ${b} ${c}`);
    }

    x;
    y;
    z;

    #internal = {
        dimensionSize: undefined
    };

    get dimensionSize() {
        return {
            get: () => this.#internal.dimensionSize,
            match: (vector) => {
                if (this.#internal.dimensionSize === 2 && MultiDimensionalVector.isVector2(vector)) {
                    return true;
                }
                else if (this.#internal.dimensionSize === 3 && MultiDimensionalVector.isVector3(vector)) {
                    return true;
                }
                else return false;
            }
        };
    }

    isValid() {
        if (this.dimensionSize.get() === 2) {
            const { x, y } = this;
            return Numeric.isNumeric(x) && Numeric.isNumeric(y);
        }
        else if (this.dimensionSize.get() === 3) {
            const { x, y, z } = this;
            return Numeric.isNumeric(x) && Numeric.isNumeric(y) && Numeric.isNumeric(z);
        }
        else return false;
    }

    is(other) {
        if (!this.dimensionSize.match(other)) return false;

        if (this.dimensionSize.get() === 2) {
            if (this.x === other.x && this.y === other.y) return true;
            else return false;
        }
        else if (this.dimensionSize.get() === 3) {
            if (this.x === other.x && this.y === other.y && this.z === other.z) return true;
            else return false;
        }
        else return false;
    }

    getLength() {
        if (MultiDimensionalVector.isVector2(this)) {
            return Math.sqrt(this.x ** 2 + this.y ** 2);
        }
        else if (MultiDimensionalVector.isVector3(this)) {
            return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        }
        else throw new Error("このインスタンスは破損しています");
    }

    setLength(length = 1) {
        if (!Numeric.isNumeric(length)) {
            throw new TypeError();
        }

        const clone = this.clone();

        for (const component of ["x", "y", "z"]) {
            if (clone[component] === undefined) continue;

            if (this.getLength() === 0) {
                clone[component] = 0;
            }
            else {
                clone[component] = this[component] / this.getLength() * length;
            }
        }

        return clone;
    }

    normalized() {
        return this.setLength();
    }

    inverted() {
        return this.multiply(-1);
    }

    getDirectionTo(vector) {
        if (MultiDimensionalVector.isVector2(vector) && this.#internal.dimensionSize === 2 || MultiDimensionalVector.isVector3(vector) && this.#internal.dimensionSize === 3) {
            const difference = this.clone();

            for (const component of Object.getOwnPropertyNames(this)) {
                if (!["x", "y", "z"].includes(component)) {
                    continue;
                }

                difference[component] = vector[component] - this[component];
            }

            return difference.setLength();
        }
        else throw new Error("渡された値がベクトルではないか、次元が一致していません");
    }

    getDistanceTo(vector) {
        if (!this.dimensionSize.match(vector)) {
            throw new TypeError("渡された値がベクトルではないか、次元が一致していません");
        }

        return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2 + ((this.z - vector.z) ?? 0) ** 2);
    }

    getRotation() {
        if (MultiDimensionalVector.isVector3(this)) {
            const { x, y, z } = this.setLength();

            const vec2 = {
                x: -Math.asin(y) * 180 / Math.PI,
                y: -Math.atan2(x, z) * 180 / Math.PI
            };

            return new MultiDimensionalVector(vec2);
        }
        else throw new Error("この関数は3次元ベクトルにのみ対応しています");
    }

    getAngleBetween(other) {
        if (!this.dimensionSize.match(other)) {
            throw new TypeError("渡された値の型が正しくないか、次元が一致していません");
        }

        const vec = new MultiDimensionalVector(other);

        const p = this.dot(vec) / (this.getLength() * vec.getLength());

        const range = new NumberRange(-1, 1);

        return Math.acos(range.round(p)) * 180 / Math.PI;
    }

    add(addend) {
        return this.calc(addend, (a, b) => a + b);
    }

    subtract(subtrahend) {
        return this.calc(subtrahend, (a, b) => a - b);
    }

    multiply(multiplier) {
        return this.calc(multiplier, (a, b) => a * b);
    }

    divide(divisor) {
        return this.calc(divisor, (a, b) => a / b);
    }

    pow(exponent) {
        return this.calc(exponent, (a, b) => a ** b);
    }

    floor() {
        return this.map(Math.floor);
    }

    ceil() {
        return this.map(Math.ceil);
    }

    round() {
        return this.map(Math.round);
    }

    abs() {
        return this.map(Math.abs);
    }

    fill(value) {
        return this.map(() => value);
    }

    dot(other) {
        if (!this.dimensionSize.match(other)) throw new Error("渡された値の型が正しくないか、次元が一致していません");
        let product = 0;
        for (const component of ["x", "y", "z"]) {
            if (this[component] === undefined) continue;
            product += this[component] * other[component];
        }
        return product;
    }

    cross(other) {
        if (!(this.dimensionSize.match(other) && this.dimensionSize.get() === 3)) throw new Error("この関数は3次元ベクトルにのみ対応しています");
        return new MultiDimensionalVector({
            x: this.y * other.z - this.z * other.y,
            y: this.z * other.x - this.x * vector.z,
            z: this.x * other.y - this.y * other.x
        });
    }

    projection(other) {
        if (!this.dimensionSize.match(other)) throw new TypeError();
        
        const vec = new MultiDimensionalVector(other);
        return vec.multiply(vec.getLength() * this.getLength() / vec.getLength() ** 2);
    }

    rejection(other) {
        if (!this.dimensionSize.match(other)) throw new TypeError();

        return this.subtract(this.projection(other));
    }

    lerp(end, t) {
        if (!this.dimensionSize.match(end)) {
            throw new Error("渡された値の型が正しくないか、次元が一致していません");
        }

        const lerp = (a, b) => (1 - t) * a + t * b;

        const result = MultiDimensionalVector.from({
            x: lerp(this.x, end.x),
            y: lerp(this.y, end.y)
        });

        if (this.dimensionSize.get() === 3) {
            result.z = lerp(this.z, end.z);
        }

        return result;
    }

    slerp(end, s) {
        if (!this.dimensionSize.match(end)) {
            throw new Error("渡された値の型が正しくないか、次元が一致していません");
        }

        // 2つのベクトルがなす角をラジアンで取得 = Θ
        const angle = this.getAngleBetween(end);

        const radian = angle * Math.PI / 180;

        // sin(Θ(1 - s))
        // ───────────── = P1
        //     sin(Θ)
        const p1 = Math.sin(radian * (1 - s)) / Math.sin(radian);

        // sin(Θs)
        // ─────── = P2
        //  sin(Θ)
        const p2 = Math.sin(radian * s) / Math.sin(radian);

        // StartVec * P1 = Q1
        const q1 = this.multiply(p1);

        // EndVec * P2 = Q2
        const q2 = MultiDimensionalVector.from(end).multiply(p2);

        // Q1 + Q2
        return q1.add(q2);
    }

    clone() {
        return new MultiDimensionalVector(this);
    }

    getLocalAxes() {
        if (this.dimensionSize.get() !== 3) {
            throw new Error("この関数は3次元ベクトルにのみ対応しています");
        }

        const zVec = this.clone().setLength();
        const xVec = new MultiDimensionalVector(zVec.z, 0, -zVec.x).setLength();
        const yVec = zVec.cross(xVec).setLength();

        return {
            x: xVec,
            y: yVec,
            z: zVec
        };
    }

    toArray() {
        const result = [];

        for (const component of ["x", "y", "z"]) {
            if (this[component] === undefined) continue;

            result.push(this[component]);
        }

        return result;
    }

    map(callbackFn) {
        const result = this.clone();

        for (const component of ["x", "y", "z"]) {
            if (this[component] === undefined) continue;

            const returnValue = callbackFn(this[component], component);

            if (Number.isNaN(returnValue)) throw new TypeError("callbackFnの返り値はnumberである必要があります");

            result[component] = returnValue;
        }

        return result;
    }

    calc(components, callbackFn) {
        let a, b, c;

        if (typeof callbackFn !== "function") {
            throw new TypeError("callbackFnは関数である必要があります");
        }

        if (Array.isArray(components)) {
            if (components.every(_ => Numeric.isNumeric(_))) {
                [a, b, c] = components;
            }
        }
        else if (MultiDimensionalVector.isVector2(components) || MultiDimensionalVector.isVector3(components)) {
            a = components.x;
            b = components.y;
            c = components.z;
        }
        else if (Numeric.isNumeric(components)) {
            a = components;
        }
        else throw new TypeError("引数が無効です");

        if (Numeric.isNumeric(a) && b === undefined && c === undefined) {
            return this.map((value, key) => callbackFn(value, a, key));
        }
        else if ((Numeric.isNumeric(a) && Numeric.isNumeric(b)) && (Numeric.isNumeric(c) || c === undefined)) {
            return this.map((value, key) => {
                switch (key) {
                    case "x": return callbackFn(value, a, key);
                    case "y": return callbackFn(value, b, key);
                    case "z": return callbackFn(value, c, key);
                }
            });
        }
        else if (Array.isArray(a) && b === undefined && c === undefined) {
            if (a.some(_ => !Numeric.isNumeric(_))) {
                throw new TypeError("引数が正しくありません : " + a);
            }
            else return this.map((value, key) => {
                switch (key) {
                    case "x": return callbackFn(value, a[0], key);
                    case "y": return callbackFn(value, a[1], key);
                    case "z": return callbackFn(value, a[2], key);
                }
            });
        }
        else if ((MultiDimensionalVector.isVector2(a) || MultiDimensionalVector.isVector3(a)) && b === undefined && c === undefined) {
            if (this.dimensionSize.match(a)) {
                return this.map((component, key) => callbackFn(component, a[key], key));
            }
            else throw new TypeError("次元が一致していません : " + a);
        }
        else throw new TypeError(`引数が正しくありません : ${a} ${b} ${c}`);
    }

    reduce(callbackFn) {
        if (typeof callbackFn !== "function") {
            throw new TypeError("引数が無効です");
        }

        return this.toArray().reduce(callbackFn);
    }

    toString(format = "875ac3e3-b714-4bb3-ac9a-58c4b18ba664") {
        const fixer = component => (component === undefined) ? "" : component.toFixed(1);

        switch (this.dimensionSize.get()) {
            case 2: {
                const text = format === "875ac3e3-b714-4bb3-ac9a-58c4b18ba664"
                    ? "($c, $c)"
                    : format;
                
                return text
                .replace("$c", fixer(this.x))
                .replace("$c", fixer(this.y))
                .replace(/\$x/g, fixer(this.x))
                .replace(/\$y/g, fixer(this.y))
                .replace(/\$c/g, "");
            }
            case 3: {
                const text = format === "875ac3e3-b714-4bb3-ac9a-58c4b18ba664"
                    ? "($c, $c, $c)"
                    : format;
                
                return text
                .replace("$c", fixer(this.x))
                .replace("$c", fixer(this.y))
                .replace("$c", fixer(this.z))
                .replace(/\$x/g, fixer(this.x))
                .replace(/\$y/g, fixer(this.y))
                .replace(/\$z/g, fixer(this.z))
                .replace(/\$c/g, "");
            }
            default:
                throw new Error();
        }
    }

    static isVector(value) {
        return this.isVector2(value) || this.isVector3(value);
    }

    static isVector2(value) {
        if (typeof value !== "object" || value === null) return false;

        return ["x", "y"].every(component => Numeric.isNumeric(value[component])) && value.z === undefined;
    }

    static isVector3(value) {
        if (typeof value !== "object" || value === null) return false;

        return ["x", "y", "z"].every(component => Numeric.isNumeric(value[component]));
    }

    static from(a, b, c) {
        return new this(a, b, c);
    }

    static getDirectionFromRotation(rotation) {
        if (!this.isVector2(rotation)) {
            throw new TypeError("この関数は回転にのみ対応しています");
        }

        const x = Math.PI / 180 * rotation.x;
        const y = Math.PI / 180 * rotation.y;

        return new this({
            x: -Math.sin(y) * Math.cos(x),
            y: -Math.sin(x),
            z: Math.cos(y) * Math.cos(x)
        });
    }

    static onCircumference(center, axis, angle, radius = 1) {
        if (!(this.isVector3(center) && this.isVector3(axis) && Numeric.isNumeric(angle) && Numeric.isNumeric(radius))) {
            throw new TypeError();
        }

        if (axis.x === 0) {
            axis.x = 1e-4;
        }

        const radian = angle * Math.PI / 180;
        const { x, y } = new MultiDimensionalVector(axis).getLocalAxes();

        return this.from(center)
            .add(x.multiply(radius * Math.cos(radian)))
            .add(y.multiply(radius * Math.sin(radian)));
    }

    static const(name) {
        if (typeof name !== "string") {
            throw new TypeError();
        }

        const ConstantSpatialVectorMap = new Map([
            ["up", [0, 1, 0]],
            ["down", [0, -1, 0]],
            ["forward", [0, 0, 1]],
            ["back", [0, 0, -1]],
            ["right", [1, 0, 0]],
            ["left", [-1, 0, 0]],
            ["zero", [0, 0, 0]],
            ["one", [1, 1, 1]]
        ]);
        return new this(ConstantSpatialVectorMap.get(name));
    }
}
