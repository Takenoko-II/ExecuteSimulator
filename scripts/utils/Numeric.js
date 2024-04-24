export class Numeric {
    constructor() {
        throw new Error();
    }

    static isNumeric(value) {
        if (typeof value === "number" && !Number.isNaN(value)) {
            return true;
        }
        else return false;
    }

    static from(value, strict = false) {
        if (strict === true) {
            if (typeof value === "string") {
                if (/^[+-]?\d+(?:\.\d+)?$/g.test(value)) {
                    return Number(value);
                }
                else return undefined;
            }
            else if (this.isNumeric(value)) {
                return value;
            }
            else return undefined;
        }
        else if (strict === false) {
            if (typeof value === "string") {
                if (/^[+-]?\d+(?:\.\d+)?$/g.test(value)) {
                    return Number(value);
                }
                else if (value === "true") {
                    return 1;
                }
                else if (["false", "null", "undefined"].includes(value)) {
                    return 0;
                }
                else return undefined;
            }
            else if (this.isNumeric(value)) {
                return value;
            }
            else if ([true, false, null, undefined].includes(value)) {
                return Number(value);
            }
            else return undefined;
        }
        else throw new TypeError();
    }

    static calculate(text) {
        if (typeof text === "string") {
            if (/^[0-9\.\+\-\*\/\(\)\% ]+=?$/g.test(text)) {
                let resultValue = undefined;

                if (text.includes("=")) text = text.slice(0, -1);

                try {
                    resultValue = Function("return " + text + ";")();
                }
                catch { throw new SyntaxError(); }

                if (this.isNumeric(resultValue)) return resultValue;
                else throw new Error();
            }
            else throw new SyntaxError();
        }
        else throw new TypeError();
    }
}
