/**
 * オブジェクトをシャローコピーして返します。
 * @param value 任意のオブジェクト
 */
export function shallowCopy<T extends object | any[]>(value: T): T;

/**
 * 値をディープコピーして返します。
 * @param value 任意の値
 */
export function deepCopy<T>(value: T): T;
