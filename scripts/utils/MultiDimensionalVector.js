export class MultiDimensionalVector {
    constructor(a, b, c) {
        if (MultiDimensionalVector.isVector2(a) && b === undefined && c === undefined) {
            this.x = a.x;
            this.y = a.y;
            this.#internal.dimensionSize = 2;
        }
        else if (MultiDimensionalVector.isVector3(a) && b === undefined && c === undefined) {
            this.x = a.x;
            this.y = a.y;
            this.z = a.z;
            this.#internal.dimensionSize = 3;
        }
        else if (Array.isArray(a) && b === undefined && c === undefined) {
            if (a.some(element => typeof element !== "number")) {
                throw new Error(`引数が正しくありません: ${a} ${b} ${c}`);
            }

            this.x = a[0];
            this.y = a[1];

            if (a[2] === undefined) {
                this.#internal.dimensionSize = 2;
            }
            else {
                this.z = a[2];
                this.#internal.dimensionSize = 3;
            }
        }
        else if (typeof a === "number" && typeof b === "number" && c === undefined) {
            this.x = a;
            this.y = b;
            this.#internal.dimensionSize = 2;
        }
        else if (typeof a === "number" && typeof b === "number" && typeof c === "number") {
            this.x = a;
            this.y = b;
            this.z = c;
            this.#internal.dimensionSize = 3;
        }
        else throw new Error(`引数が正しくありません: ${a} ${b} ${c}`);
    }

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

    is(vector) {
        if (!this.dimensionSize.match(vector)) return false;

        if (this.dimensionSize.get() === 2) {
            if (this.x === vector.x && this.y === vector.y) return true;
            else return false;
        }
        else if (this.dimensionSize.get() === 3) {
            if (this.x === vector.x && this.y === vector.y && this.z === vector.z) return true;
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
        if (typeof length !== "number") {
            throw new Error("lengthはnumberである必要があります");
        }

        const result = new MultiDimensionalVector(0, 0, 0);

        for (const component of ["x", "y", "z"]) {
            if (component === "z" && this.#internal.dimensionSize === 2) {
                continue;
            }
            if (this.getLength() === 0) {
                result[component] = 0;
            }
            else {
                result[component] = this[component] / this.getLength() * length;
            }
        }

        return result;
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
            throw new Error("渡された値がベクトルではないか、次元が一致していません");
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

    getAngleBetween(vector) {
        if (!this.dimensionSize.match(vector)) {
            throw new Error("渡された値の型が正しくないか、次元が一致していません");
        }

        const vec = new MultiDimensionalVector(vector);

        return this.inner(vector) / (this.getLength() * vec.getLength());
    }

    add(vector) {
        if (!this.dimensionSize.match(vector)) {
            throw new Error("渡された値がベクトルではないか、次元が一致していません");
        }

        const result = { x: this.x, y: this.y, z: this.z };

        for (const component of Object.getOwnPropertyNames(this)) {
            if (["x", "y", "z"].includes(component)) {
                result[component] = this[component] + vector[component];
            }
        }

        return new MultiDimensionalVector(result);
    }

    subtract(vector) {
        if (!this.dimensionSize.match(vector)) {
            throw new Error("渡された値がベクトルではないか、次元が一致していません");
        }

        const result = { x: this.x, y: this.y, z: this.z };

        for (const component of Object.getOwnPropertyNames(this)) {
            if (["x", "y", "z"].includes(component)) {
                result[component] = this[component] - vector[component];
            }
        }

        return new MultiDimensionalVector(result);
    }

    multiply(multiplier) {
        const result = { x: this.x, y: this.y, z: this.z };

        if (this.dimensionSize.match(multiplier)) {
            for (const component of Object.getOwnPropertyNames(this)) {
                if (["x", "y", "z"].includes(component)) {
                    result[component] = this[component] * multiplier[component];
                }
            }

            return new MultiDimensionalVector(result);
        }
        else if (typeof multiplier === "number") {
            for (const component of Object.getOwnPropertyNames(this)) {
                if (["x", "y", "z"].includes(component)) {
                    result[component] = this[component] * multiplier;
                }
            }

            return new MultiDimensionalVector(result);
        }
        else throw new Error("渡された値の型が正しくないか、次元が一致していません");
    }

    divide(divisor) {
        const result = { x: this.x, y: this.y, z: this.z };

        if (this.dimensionSize.match(divisor)) {
            for (const component of Object.getOwnPropertyNames(this)) {
                if (["x", "y", "z"].includes(component)) {
                    result[component] = this[component] / divisor[component];
                }
            }

            return new MultiDimensionalVector(result);
        }
        else if (typeof divisor === "number") {
            for (const component of Object.getOwnPropertyNames(this)) {
                if (["x", "y", "z"].includes(component)) {
                    result[component] = this[component] / divisor;
                }
            }

            return new MultiDimensionalVector(result);
        }
        else throw new Error("渡された値の型が正しくないか、次元が一致していません");
    }

    pow(exponent) {
        const result = { x: this.x, y: this.y, z: this.z };

        if (this.dimensionSize.match(exponent)) {
            for (const component of Object.getOwnPropertyNames(this)) {
                if (["x", "y", "z"].includes(component)) {
                    result[component] = this[component] / exponent[component];
                }
            }

            return new MultiDimensionalVector(result);
        }
        else if (typeof exponent === "number") {
            for (const component of Object.getOwnPropertyNames(this)) {
                if (["x", "y", "z"].includes(component)) {
                    result[component] = this[component] ** exponent;
                }
            }

            return new MultiDimensionalVector(result);
        }
        else throw new Error("渡された値の型が正しくないか、次元が一致していません");
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

    inner(vector) {
        if (!this.dimensionSize.match(vector)) throw new Error("渡された値の型が正しくないか、次元が一致していません");
        let product = 0;
        for (const component of ["x", "y", "z"]) {
            if (this[component] === undefined) continue;
            product += this[component] * vector[component];
        }
        return product;
    }

    cross(vector) {
        if (!(this.dimensionSize.match(vector) && this.dimensionSize.get() === 3)) throw new Error("この関数は3次元ベクトルにのみ対応しています");
        return new MultiDimensionalVector({
            x: this.y * vector.z - this.z * vector.y,
            y: this.z * vector.x - this.x * vector.z,
            z: this.x * vector.y - this.y * vector.x
        });
    }

    lerp(vector, t) {
        if (!this.dimensionSize.match(vector)) {
            throw new Error("渡された値の型が正しくないか、次元が一致していません");
        }

        const lerp = (a, b) => (1 - t) * a + t * b;

        const result = MultiDimensionalVector.from({
            x: lerp(this.x, vector.x),
            y: lerp(this.y, vector.y)
        });

        if (this.dimensionSize.get() === 3) {
            result.z = lerp(this.z, vector.z);
        }

        return result;
    }

    clone() {
        return new MultiDimensionalVector(this);
    }

    getLocalDirections() {
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

    map(callbackFn) {
        const result = this.clone();

        for (const component of ["x", "y", "z"]) {
            if (this[component] === undefined) continue;

            const returnValue = callbackFn(this[component]);

            if (Number.isNaN(returnValue)) throw new TypeError("callbackFnの返り値はnumberである必要があります");

            result[component] = returnValue;
        }

        return result;
    }

    static isVector2(value) {
        if (!(typeof value === "object" && value !== null)) return false;

        return ["x", "y"].every(component => typeof value[component] === "number") && value.z === undefined;
    }

    static isVector3(value) {
        if (!(typeof value === "object" && value !== null)) return false;

        return ["x", "y", "z"].every(component => typeof value[component] === "number");
    }

    static from(a, b, c) {
        return new this(a, b, c);
    }

    static getDirectionFromRotation(rotation) {
        if (!this.isVector2(rotation)) {
            throw new Error("この関数は回転にのみ対応しています");
        }

        const x = Math.PI / 180 * rotation.x;
        const y = Math.PI / 180 * rotation.y;

        return new this({
            x: -Math.sin(y) * Math.cos(x),
            y: -Math.sin(x),
            z: Math.cos(y) * Math.cos(x)
        });
    }

    static getCircumferentialVector(center, axis, angle, radius = 1) {
        if (axis.x === 0) {
            axis.x = 1e-4;
        }

        const radian = angle * Math.PI / 180;
        const xAxis = new this(axis.z, 0, -axis.x).setLength();
        const yAxis = xAxis.cross(axis).setLength();

        return this.from(center)
            .add(xAxis.multiply(radius * Math.cos(radian)))
            .add(yAxis.multiply(radius * Math.sin(radian)));
    }

    static const(name) {
        const ConstantVectorMap = new Map([
            ["up", [0, 1, 0]],
            ["down", [0, -1, 0]],
            ["forward", [0, 0, 1]],
            ["back", [0, 0, -1]],
            ["right", [1, 0, 0]],
            ["left", [-1, 0, 0]],
            ["zero", [0, 0, 0]],
            ["one", [1, 1, 1]]
        ]);
        return new this(ConstantVectorMap.get(name));
    }
}