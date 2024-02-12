export function shallowCopy(object) {
    if (typeof object !== "object" || object === null) {
        return object;
    }
    else {
        return Object.assign({}, object);
    }
}

export function deepCopy(object) {
    if (typeof object !== "object" || object === null) {
        return object;
    }
    else {
        const result = Array.isArray(object) ? [] : {};

        for (const [key, value] of Object.entries(object)) {
            result[key] = deepCopy(value);
        }

        return result;
    }
}
