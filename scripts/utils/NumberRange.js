import { numberFunctions } from "./number";

export class NumberRange {
    constructor(value1, value2 = 0) {
        this.min = Math.min(value1, value2);
        this.max = Math.max(value1, value2);
        this.size = this.max - this.min;
    }
    isWithin(value) {
        if (!numberFunctions.isAbsolutelyNumber(value)) return;
        if (value >= this.min && value <= this.max) return true;
        else return false;
    }
    getAllValues() {
        let { min, max } = this;
        let digit = 1;
        let loopCount = 0;
        while (loopCount < 20 && (!Number.isInteger(min) || !Number.isInteger(max))) {
            min *= 10;
            max *= 10;
            digit *= 10;
            loopCount += 1;
        }
        const result = [];
        for (let i = min; i <= max; i++) {
            const value = i / digit;
            result.push(value);
        }
        return result;
    }
    round(value) {
        if (!numberFunctions.isAbsolutelyNumber(value)) return;
        if (value < this.min) return this.min;
        else if (value > this.max) return this.max;
        else return value;
    }
}
