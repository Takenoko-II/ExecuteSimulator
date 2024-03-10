import { Vector2, Vector3 } from "@minecraft/server";

/**
 * 多次元ベクトル
 */
export class MultiDimensionalVector {
    /**
     * 二次元ベクトルを基に多次元ベクトルのインスタンスを作成します。
     * @param vector 二次元ベクトル
     */
    constructor(vector: Vector2);

    /**
     * 三次元ベクトルを基に多次元ベクトルのインスタンスを作成します。
     * @param vector 三次元ベクトル
     */
    constructor(vector: Vector3);

    /** 
     * 長さ2の配列を基に多次元ベクトルのインスタンスを作成します。
     * @param vector 二次元ベクトル
     */
    constructor(vector: [number, number]);

    /**
     * 長さ3の配列を基に多次元ベクトルのインスタンスを作成します。
     * @param vector 三次元ベクトル
     */
    constructor(vector: [number, number, number]);

    /**
     * 次元数を基に多次元ベクトルのインスタンスを作成します。
     * @param dimensionSize 次元の大きさ
     */
    constructor(dimensionSize: number);

    /**
     * x, yの二成分を基に多次元ベクトルのインスタンスを作成します。
     * @param x ベクトルのx成分
     * @param y ベクトルのy成分
     */
    constructor(x: number, y: number);

    /**
     * x, y, zの三成分を基に多次元ベクトルのインスタンスを作成します。
     * @param x ベクトルのx成分
     * @param y ベクトルのy成分
     * @param z ベクトルのz成分
     */
    constructor(x: number, y: number, z: number);

    /**
     * x成分    
     * このプロパティは削除不可能です。
     */
    x: number;

    /**
     * y成分    
     * このプロパティは削除不可能です。
     */
    y: number;

    /**
     * z成分    
     * このプロパティは削除不可能です。
     */
    z?: number;

    /**
     * 次元の大きさ
     */
    readonly dimensionSize: VectorDimensionSize;

    /**
     * 各成分の値が数値であれば真を返します。
     */
    isValid(): boolean;

    /**
     * 2つのベクトルを比較し、等しければtrueを返します。
     * @param other 比較するベクトル
     */
    is(other: Vector2 | Vector3): boolean;

    /**
     * ベクトルの長さを返します。
     */
    getLength(): number;

    /**
     * ベクトルの長さを変更した新しいベクトルを返します。    
     * 長さが指定されなかった場合単位ベクトルになります。
     * @param length ベクトルの長さ
     */
    setLength(length?: number): MultiDimensionalVector;

    /**
     * ベクトルの長さを1にした新しいベクトルを返します。
     */
    normalized(): MultiDimensionalVector;

    /**
     * ベクトルの向きを逆にした新しいベクトルを返します。
     */
    inverted(): MultiDimensionalVector;

    /**
     * 別のベクトルへの方向を返します。
     * @param vector 対象のベクトル
     */
    getDirectionTo(vector: Vector2 | Vector3): MultiDimensionalVector;

    /**
     * 別のベクトルとの距離を返します。
     * @param vector 対象のベクトル
     */
    getDistanceTo(vector: Vector2 | Vector3): number;

    /**
     * ベクトルの回転を返します。
     */
    getRotation(): MultiDimensionalVector;

    /**
     * 自身と別のベクトルがなす角の大きさを求めます。
     * @param other ベクトル
     */
    getAngleBetween(other: Vector2 | Vector3): number;

    /**
     * 別のベクトル・数との足し算を行います。
     * @param addend 加数
     */
    add(addend: number | Vector2 | Vector3 | [number, number] | [number, number, number]): MultiDimensionalVector;

    /**
     * 別のベクトル・数との引き算を行います。
     * @param subtrahend 減数
     */
    subtract(subtrahend: number | Vector2 | Vector3 | [number, number] | [number, number, number]): MultiDimensionalVector;

    /**
     * 別のベクトル・数との掛け算を行います。
     * @param multiplier 乗数
     */
    multiply(multiplier: number | Vector2 | Vector3 | [number, number] | [number, number, number]): MultiDimensionalVector;

    /**
     * 別のベクトル・数との割り算を行います。
     * @param divisor 除数
     */
    divide(divisor: number | Vector2 | Vector3 | [number, number] | [number, number, number]): MultiDimensionalVector;

    /**
     * 別のベクトル・数を指数として冪乗を行います。
     * @param exponent 指数
     */
    pow(exponent: number | Vector2 | Vector3 | [number, number] | [number, number, number]): MultiDimensionalVector;

    /**
     * 各成分の小数点以下を切り捨てしたベクトルを返します。
     */
    floor(): MultiDimensionalVector;

    /**
     * 各成分の小数点以下を切り上げしたベクトルを返します。
     */
    ceil(): MultiDimensionalVector;

    /**
     * 各成分の小数点以下を四捨五入したベクトルを返します。
     */
    round(): MultiDimensionalVector;

    /**
     * 各成分をその絶対値にしたベクトルを返します。
     */
    abs(): MultiDimensionalVector;

    /**
     * 各成分を指定の値にしたベクトルを返します。
     * @param value 任意の値
     */
    fill(value: number): MultiDimensionalVector;

    /**
     * 別のベクトルとの内積を求めます。
     * @param other ベクトル
     */
    dot(other: Vector2 | Vector3): number;

    /**
     * 別のベクトルとの外積を求めます。
     * @param other ベクトル
     */
    cross(other: Vector3): MultiDimensionalVector;

    /**
     * このベクトルの別のベクトルへの射影ベクトルを求めます。
     * @param other ベクトル
     */
    projection(other: Vector2 | Vector3): MultiDimensionalVector;

    /**
     * このベクトルの別のベクトルからの反射影ベクトルを求めます。
     * @param other ベクトル
     */
    rejection(other: Vector2 | Vector3): MultiDimensionalVector;

    /**
     * endを終了位置とし、tを割合とした線形補間を返します。
     * @param end 終了位置
     * @param t 割合
     */
    lerp(end: Vector2 | Vector3, t: number): MultiDimensionalVector;

    /**
     * endを終了位置とし、sを割合とした球面線形補間を返します。
     * @param end 終了位置
     * @param s 割合
     */
    slerp(end: Vector2 | Vector3, s: number): MultiDimensionalVector;

    /**
     * 自身と成分の各値が同じベクトルを返します。
     */
    clone(): MultiDimensionalVector;

    /**
     * 自身をローカル座標のz成分とし、ローカル座標の各成分となる座標を取得します。
     */
    getLocalAxes(): LocalAxes;

    /**
     * 成分の各値を格納した配列を返します。
     */
    toArray(): [number, number] | [number, number, number];

    /**
     * 与えられた関数をベクトルの各成分に対して呼び出し、その結果から新しいベクトルを作成します。
     * @param callbackFn 各成分に対して実行する関数
     */
    map(callbackFn: (component: number, key: "x" | "y" | "z") => number): MultiDimensionalVector;

    /**
     * 与えられた関数をベクトルの各成分に対して呼び出し、その結果から新しいベクトルを作成します。
     * @param components コールバックに分解されて渡される値
     * @param callbackFn 各成分に対して実行する関数
     */
    calc(components: number | Vector2 | Vector3 | [number, number] | [number, number, number], callbackFn: (a: number, b: number, key: "x" | "y" | "z") => number): MultiDimensionalVector;

    /**
     * 配列化したベクトルのreduce関数に与えられた関数を渡します。
     * @param callbackFn コールバック関数
     */
    reduce(callbackFn: (previousValue: number, currentValue: number, currentIndex: number, array: [number, number] | [number, number, number]) => number): number;

    /**
     * ベクトルを文字列化します。
     * @param format 形式
     */
    toString(format?: string): string;

    /**
     * 値がベクトルであればtrueを返します。
     * @param value 任意の値
     */
    static isVector(value: any): boolean;

    /**
     * 値がVector2であればtrueを返します。
     * @param value 任意の値
     */
    static isVector2(value: any): boolean;

    /**
     * 値がVector3であればtrueを返します。
     * @param value 任意の値
     */
    static isVector3(value: any): boolean;

    /**
     * constructorと等価です。    
     * 二次元ベクトルを基に多次元ベクトルのインスタンスを作成します。
     * @param vector 二次元ベクトル
     */
    static from(vector: Vector2): MultiDimensionalVector;

    /**
     * constructorと等価です。    
     * 三次元ベクトルを基に多次元ベクトルのインスタンスを作成します。
     * @param vector 三次元ベクトル
     */
    static from(vector: Vector3): MultiDimensionalVector;

    /**
     * constructorと等価です。    
     * 長さ2の配列を基に多次元ベクトルのインスタンスを作成します。
     * @param vector 二次元ベクトル
     */
    static from(vector: [number, number]): MultiDimensionalVector;

    /**
     * constructorと等価です。    
     * 長さ3の配列を基に多次元ベクトルのインスタンスを作成します。
     * @param vector 三次元ベクトル
     */
    static from(vector: [number, number, number]): MultiDimensionalVector;

    /**
     * constructorと等価です。 
     * 次元数を基に多次元ベクトルのインスタンスを作成します。
     * @param dimensionSize 次元の大きさ
     */
    from(dimensionSize: number): MultiDimensionalVector;

    /**
     * constructorと等価です。    
     * x, yの二成分を基に多次元ベクトルのインスタンスを作成します。
     * @param x ベクトルのx成分
     * @param y ベクトルのy成分
     */
    static from(x: number, y: number): MultiDimensionalVector;

    /**
     * constructorと等価です。    
     * x, y, zの三成分を基に多次元ベクトルのインスタンスを作成します。
     * @param x ベクトルのx成分
     * @param y ベクトルのy成分
     * @param z ベクトルのz成分
     */
    static from(x: number, y: number, z: number): MultiDimensionalVector;

    /**
     * 回転からベクトルを取得します。
     * @param rotation 回転
     */
    static getDirectionFromRotation(rotation: Vector2): MultiDimensionalVector;

    /**
     * 円周上の座標を取得します。
     * @param center 円の中心
     * @param axis 円の中心を通り、且つ円に垂直な単位ベクトル
     * @param angle 円の中心からの角度
     * @param radius 円の半径
     */
    static onCircumference(center: Vector3, axis: Vector3, angle: number, radius?: number): MultiDimensionalVector;

    /**
     * 定数ベクトルを取得します。
     * @param name 各定数ベクトルと紐づけられた名称
     */
    static const<T extends keyof ConstantSpatialVectorMap>(name: T): ConstantSpatialVectorMap[T];

    static readonly prototype: MultiDimensionalVector;
}

type ConstantSpatialVectorMap = {
    /**
     * (0, 1, 0)
     */
    readonly up: MultiDimensionalVector;

    /**
     * (0, -1, 0)
     */
    readonly down: MultiDimensionalVector;

    /**
     * (0, 0, 1)
     */
    readonly forward: MultiDimensionalVector;

    /**
     * (0, 0, -1)
     */
    readonly back: MultiDimensionalVector;

    /**
     * (1, 0, 0)
     */
    readonly right: MultiDimensionalVector;

    /**
     * (-1, 0, 0)
     */
    readonly left: MultiDimensionalVector;

    /**
     * (0, 0, 0)
     */
    readonly zero: MultiDimensionalVector;

    /**
     * (1, 1, 1)
     */
    readonly one: MultiDimensionalVector;
};

interface VectorDimensionSize {
    /**
     * 値を取得します。
     */
    get(): number;

    /**
     * 別のベクトルと次元の大きさが一致しているかどうかを返します。
     * @param vector 比較するベクトル
     */
    match(vector: Vector2 | Vector3): boolean;
}

interface LocalAxes {
    /**
     * ローカル座標のx成分
     */
    readonly x: MultiDimensionalVector;

    /**
     * ローカル座標のy成分
     */
    readonly y: MultiDimensionalVector;

    /**
     * ローカル座標のz成分
     */
    readonly z: MultiDimensionalVector;
}
