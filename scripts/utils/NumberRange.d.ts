import { numberFunctions } from "./number";

export class NumberRange {
    /**
     * 数値の範囲データを作成します。
     * @param value1 任意の数値。
     * @param value2 任意の数値。
     */
    constructor(value1: number, value2?: number);
    /**
     * 範囲の最小値。
     */
    readonly min: number;
    /**
     * 範囲の最大値。
     */
    readonly max: number;
    /**
     * 範囲の大きさ。
     */
    readonly size: number;
    /**
     * 渡された値が範囲の中の値であるかどうかを返します。
     * @param value 任意の数値。
     */
    isWithin(value: number): boolean;
    /**
     * 取りうる全ての値を格納した配列を返します。    
     * 値の桁は最大値・最小値のうち最小桁が大きい方の桁数までです。
     */
    getAllValues(): number[];
    /**
     * 渡された値を範囲内の値に丸めます。
     * @param value 任意の数値。
     */
    round(value: number): number;
}
