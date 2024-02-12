import { Entity, Vector2, Vector3 } from "@minecraft/server";

import { CommandSourceStack } from "./CommandSourceStack";

/**
 * コマンド「execute」で行うことができる操作と同様の操作を行うことができます。
 * 
 * @example
 * import { world } from "@minecraft/server";
 * 
 * import { CommandSourceStack } from "./execute/CommandSourceStack";
 * 
 * import { Execute } from "./execute/Execute";
 * 
 * import { MultiDimensionalVector } from "./utils/MultiDimensionalVector";
 * 
 * world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
 *     if (itemStack.typeId !== "minecraft:stick") return;
 * 
 *     const CSS = new CommandSourceStack(source);
 *     const execute = new Execute(CSS);
 * 
 *     // 自身とスコアが一致する防具立てを取得
 *     const targets = execute
 *         .at("@e[type=armor_stand]")
 *         .if.score("@s obj", "=", "@e[c=1] obj")
 *         .commandSourceStacks.slice(0)
 *         .map(_ => _.readSelector("@e[c=1]")[0]);
 * 
 *     // 防具立てをこっちへ飛ばす!
 *     targets.forEach(target => {
 *         const vector = new MultiDimensionalVector(source.location)
 *             .subtract(target.location);
 * 
 *         target.applyImpulse(vector);
 *     });
 * });
 */
export class Execute {
    /**
     * executeコマンドを実行開始します。
     * @param defaultSource デフォルトの実行情報
     */
    constructor(defaultSource?: CommandSourceStack);

    /**
     * 現在監視されているコマンドソーススタックのリスト
     */
    readonly commandSourceStacks: CommandSourceStack[];

    /**
     * コマンドソーススタックの変移を保存するデータベース
     */
    readonly transition: CommandSourceStack[][];

    /**
     * サブコマンドas
     * @param selector 実行者となるエンティティ
     */
    as(selector: string | Entity[]): Execute;

    /**
     * サブコマンドat
     * @param selector 座標となるエンティティ
     */
    at(selector: string | Entity[]): Execute;

    /**
     * サブコマンドpositioned
     */
    readonly positioned: {
        /**
         * 座標の入力により実行座標を変更します。
         * @param location 座標
         */
        $(location: string | Vector3): Execute;

        /**
         * セレクターの入力により実行座標を変更します。
         * @param selector 座標となるエンティティ
         */
        as(selector: string | Entity[]): Execute;
    }

    /**
     * サブコマンドrotated
     */
    readonly rotated: {
        /**
         * 回転の入力により実行方向を変更します。
         * @param rotation 回転
         */
        $(rotation: string | Vector2): Execute;

        /**
         * 回転の入力により実行方向を変更します。
         * @param selector 回転となるエンティティ
         */
        as(selector: string | Entity[]): Execute;
    }

    /**
     * サブコマンドfacing
     */
    readonly facing: {
        /**
         * 座標の入力により実行方向を変更します。
         * @param location 座標
         */
        $(location: string | Vector3): Execute;

        /**
         * 回転の入力により実行方向を変更します。
         * @param selector 回転となるエンティティ
         * @param anchor アンカー
         */
        entity(selector: string | Entity[], anchor: "eyes" | "feet"): Execute;
    }

    /**
     * 実行座標の小数点以下を切り捨てます。
     * @param axes 切り捨てる軸
     */
    align(axes: string): Execute;

    /**
     * サブコマンドif
     */
    readonly if: {
        /**
         * セレクターを満たすエンティティが存在することを処理続行の条件とします。
         * @param selector 条件となるエンティティ
         */
        entity(selector: string | Entity[]): Execute;

        /**
         * 指定の位置に特定のブロックが存在することを処理続行の条件とします。
         * @param location 条件となる座標
         * @param id ブロックのid
         * @param states ブロック状態
         */
        block(location: string | Vector3, id: string, states?: string): Execute;

        /**
         * 指定の2範囲が一致することを処理続行の条件とします。
         * @param bigin 比較元始点座標
         * @param end 比較元終点座標
         * @param destination 比較先始点座標
         * @param scanMode 比較時のモード
         */
        blocks(bigin: string | Vector3, end: string | Vector3, destination: string | Vector3, scanMode: "all" | "masked"): Execute;

        /**
         * 特定のオブジェクトにおける2つのスコアホルダーの値が条件を満たすことを処理続行の条件とします。
         * @param scoreA スコアホルダーA
         * @param operator 比較演算子
         * @param scoreB スコアホルダーB
         */
        score(scoreA: string | number, operator: string, scoreB: string | number): Execute;
    }

    /**
     * サブコマンドunless
     */
    readonly unless: {
        /**
         * セレクターを満たすエンティティが存在しないことを処理続行の条件とします。
         * @param selector 条件となるエンティティ
         */
        entity(selector: string | Entity[]): Execute;

        /**
         * 指定の位置に特定のブロックが存在しないことを処理続行の条件とします。
         * @param location 条件となる座標
         * @param id ブロックのid
         * @param states ブロック状態
         */
        block(location: string | Vector3, id: string, states?: string): Execute;

        /**
         * 指定の2範囲が一致しないことを処理続行の条件とします。
         * @param bigin 比較元始点座標
         * @param end 比較元終点座標
         * @param destination 比較先始点座標
         * @param scanMode 比較時のモード
         */
        blocks(bigin: string | Vector3, end: string | Vector3, destination: string | Vector3, scanMode: "all" | "masked"): Execute;

        /**
         * 特定のオブジェクトにおける2つのスコアホルダーの値が条件を満たさないことを処理続行の条件とします。
         * @param scoreA スコアホルダーA
         * @param operator 比較演算子
         * @param scoreB スコアホルダーB
         */
        score(scoreA: string | number, operator: string, scoreB: string | number): Execute;
    }

    /**
     * サブコマンドin
     * @param dimension ディメンション名
     */
    in(dimension: "overworld" | "nether" | "the_end"): Execute;

    /**
     * サブコマンドanchored(Java Edition)
     * @param anchor アンカー
     */
    anchored(anchor: "eyes" | "feet"): Execute;

    /**
     * サブコマンドrun
     * @param command 実行するコマンド
     */
    run(command: string): void;

    /**
     * 実行座標と実行方向の変移を表示します。
     */
    display(): void;

    /**
     * 実行情報を一括で編集します。
     * @param callbackFn コールバック関数
     */
    modify(callbackFn: (CSS: CommandSourceStack) => CommandSourceStack): Execute;

    static readonly prototype: Execute;
}
