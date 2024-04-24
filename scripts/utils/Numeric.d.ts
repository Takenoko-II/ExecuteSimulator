export class Numeric {
    /**
     * 値がNaNでない数値であれば真を返します。
     * @param value 任意の値
     */
    static isNumeric(value: any): boolean;

    /**
     * 値を数値に変換します。
     * @param value 任意の値
     * @param strict trueにすると数値かそれを明確に表す文字列のみを変換するようになります。
     */
    static from(value: string | number | boolean | null | undefined, strict?: boolean): number | undefined;

    /**
     * 文字列を式とみなし演算します。
     * @param text 計算式
     */
    static calculate(text: string): number;
}
