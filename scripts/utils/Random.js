import { NumberRange } from "./NumberRange";

import { shallowCopy } from "./generic";

export class Random extends NumberRange {
    constructor(value1 = 0, value2 = 0) {
        super(value1, value2);
            const range = shallowCopy(this);
            this.xorshift = new Xorshift(0);
            this.xorshift.range = range;
    }
    generate() {
        let { min, max } = this;
        let digit = 1;
        let loopCount = 0;
        while (loopCount < 20 && (!Number.isInteger(min) || !Number.isInteger(max))) {
            min *= 10;
            max *= 10;
            digit *= 10;
            loopCount += 1;
        }
        return Math.floor(Math.random() * (max + 1 - min) + min) / digit;
    }
    static shuffle(array) {
        if (!Array.isArray(array)) {
            throw new TypeError("Unexpected type passed to function argument[0].");
        }

        const clone = shallowCopy(array);
        for (let i = clone.length - 1; i >= 0; i--) {
            const current = clone[i];
            const random = Math.floor(Math.random() * (i + 1));

            clone[i] = clone[random];
            clone[random] = current;
        }

        return clone;
    }
    static select(array) {
        if (!Array.isArray(array)) {
            throw new TypeError("Unexpected type passed to function argument[0].");
        }

        return array[Math.floor(Math.random() * array.length)];
    }
    static chance(chance = 0.5) {
        const number = Math.random() + chance;
        if (number >= 1) return true;
        else return false;
    }
    static sign() {
        if (this.chance()) return 1;
        return -1;
    }
    static uuid() {
        const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
        for (let i = 0; i < chars.length; i++) {
            switch (chars[i]) {
                case 'x':
                    chars[i] = new Random(0, 15).generate().toString(16);
                    break;
                case 'y':
                    chars[i] = new Random(8, 11).generate().toString(16);
                    break;
            }
        }
        return chars.join('');
    }
}

export class Xorshift {
    constructor(seed) {
        this.seed = seed;
    }
    #x = 123456789;
    #y = 362436069;
    #z = 521288629;
    rand(range = undefined) {
        if (range === undefined) range = this.range;
        let t = this.#x ^ (this.#x << 11);
        this.#x = this.#y;
        this.#y = this.#z;
        this.#z = this.seed;
        this.seed = (this.seed ^ (this.seed >>> 19)) ^ (t ^ (t >>> 8));
        if (range !== undefined) {
            let { min, max } = range;
            let digit = 1;
            let loopCount = 0;
            while (loopCount < 20 && (!Number.isInteger(min) || !Number.isInteger(max))) {
                min *= 10;
                max *= 10;
                digit *= 10;
                loopCount += 1;
            }
            return (Math.abs(this.seed) % (max + 1 - min) + min) / digit;
        }
        return this.seed;
    }
    uuid() {
        const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
        for (let i = 0; i < chars.length; i++) {
            switch (chars[i]) {
                case 'x':
                    chars[i] = this.rand(new NumberRange(0, 15)).toString(16);
                    break;
                case 'y':
                    chars[i] = this.rand(new NumberRange(8, 11)).toString(16);
                    break;
            }
        }
        return chars.join('');
    }
    shuffle(array) {
        if (!Array.isArray(array)) {
            throw new TypeError("Unexpected type passed to function argument[0].");
        }

        const clone = shallowCopy(array);
        for (let i = clone.length - 1; i >= 0; i--) {
            const current = clone[i];
            const random = this.rand({ min: 0, max: i });

            clone[i] = clone[random];
            clone[random] = current;
        }

        return clone;
    }
}
