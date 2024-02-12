interface NumberFunctions {
    /**
     * 渡された文字列を数値型に変換します。    
     * 数値型に変換できなければ未定義を返します。
     * @param string 任意の文字列
     */
    toNumber(string: string): number | undefined;

    /**
     * 渡されたものがNaNではない数値型であるかどうかを返します。
     * @param value 任意の値
     */
    isAbsolutelyNumber(value: any): boolean;
}

/**
 * 今後別のものに置き換えられる予定です。
 */
export const numberFunctions: NumberFunctions;
