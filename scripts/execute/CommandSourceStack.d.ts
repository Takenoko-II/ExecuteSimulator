import { Block, CommandResult, Dimension, Entity, Vector2, Vector3 } from "@minecraft/server";

export class CommandSourceStack {
    /**
     * コマンドソースを作成します。
     */
    constructor(origin?: Entity | Block | "server");

    /**
     * id
     */
    readonly id: string;

    /**
     * 親となるコマンドソーススタックのid
     */
    readonly parentId?: string;

    /**
     * 実行者
     */
    entity: Entity | null;

    /**
     * 実行座標
     */
    location: Vector3;

    /**
     * 実行方向
     */
    rotation: Vector2;

    /**
     * 実行ディメンション
     */
    dimension: Dimension;

    /**
     * 実行アンカー
     */
    anchor: "eyes" | "feet";

    /**
     * 実行元の情報
     */
    readonly origin: CommandSourceStackOrigin;

    /**
     * このコマンドソーススタックのコピーを返します。
     */
    clone(): CommandSourceStack;

    /**
     * 渡されたセレクターを解析します。
     * @param selector セレクター
     */
    readSelector(selector: string | Entity[]): (Entity | null)[];

    /**
     * 渡された座標を解析します。
     * @param coordinates 座標
     */
    readCoordinates(coordinates: string | Vector3): Vector3;

    /**
     * 渡された回転を解析します。
     * @param rotation 回転
     */
    readRotation(rotation: string | Vector2): Vector2;

    /**
     * 渡されたスコアホルダーとオブジェクトを解析します。
     * @param score スコアホルダーとオブジェクト
     */
    readScore(score: string | number): number | undefined;

    /**
     * 現在のエンティティアンカーを返します。
     */
    getEntityAnchor(): Vector3;

    /**
     * コマンドを実行します。
     * @param command コマンド
     */
    runCommand(command: string): CommandResult;

    static readonly prototype: CommandSourceStack;

    /**
     * 渡されたブロック状態を解析します。
     * @param states ブロック状態
     */
    static readBlockStates(states: string): Record<string, string | number | boolean>;
}

interface CommandSourceStackOrigin {
    /**
     * 実行元のid
     */
    readonly typeId: string;

    /**
     * 実行元の権限レベル
     */
    readonly permissionLevel: number;
}
