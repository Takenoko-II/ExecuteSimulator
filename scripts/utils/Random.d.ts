import { NumberRange } from "./NumberRange";

export class Random extends NumberRange {
    /**
     * 乱数の範囲データを作成します。
     * @param value1 任意の値
     * @param value2 任意の値
     */
    constructor(value1: number, value2?: number);
    /**
     * この範囲の中の値を返すXorshiftオブジェクト
     */
    readonly xorshift: Xorshift;
    /**
     * 範囲データから乱数を生成します。
     */
    generate(): number;
    /**
     * 渡された配列をシャッフルします。
     */
    static shuffle<T>(array: T[]): T[];
    /**
     * 渡された配列からランダムな要素を一つ選び出します。
     */
    static select<T>(array: T[]): T[];
    /**
     * 1を100%として、渡された数値の確率でtrueを返します。    
     * 外れるとfalseを返します。
     * @param chance trueを返す確率
     */
    static chance(chance?: number): boolean;
    /**
     * +か-のどちらかの符号をそれぞれ1/2の確率で返します。
     */
    static sign(): number;
    /**
     * ランダムなUUIDを生成します。
     */
    static uuid(): string;
}

export class Xorshift {
    /**
     * Xorshiftデータを作成します。
     * @param seed シード値
     */
    constructor(seed: number);
    /**
     * シード値
     */
    seed: number;
    /**
     * 数値の範囲
     */
    readonly range?: NumberRange;
    /**
     * シード値を基に乱数を生成します。
     */
    rand(range?: NumberRange): number;
    /**
     * シード値を基にUUIDを生成します。
     */
    uuid(): string;
    /**
     * シード値を基に配列をシャッフルします。
     * @param array 配列
     */
    shuffle<T>(array: T[]): T[];
}