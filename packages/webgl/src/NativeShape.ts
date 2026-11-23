/**
 * @description 実行環境が提供する、図形の「経路の組み立て」と「塗りのメッシュの生成」の実装。
 *              JIT が使えない実行環境 (ゲーム機向けのホスト) が、グローバルの __next2dShape に置く。
 *              無い環境 (ブラウザ) では null で、すべて JavaScript で処理する。結果はどちらも同じ。
 *
 *              The implementation of path building and fill mesh generation provided by the runtime.
 *              Runtimes without a JIT (hosts for game consoles) put it on the global as
 *              __next2dShape. Where it is absent (browsers) this is null and everything runs in
 *              JavaScript. Both produce the same result.
 */
export interface INativeShape {
    // commands[index] から続く経路の命令をまとめて処理し、経路でない命令の位置を返す
    path (commands: Float32Array, index: number, scale_squared: number): number;
    // いまの経路を塗りのメッシュにしたときの要素数 (0 なら塗るものが無い)
    fillSize (): number;
    // メッシュを target[offset..] へ書き、頂点数を返す。経路は空になる
    fill (
        target: Float32Array, offset: number,
        a: number, b: number, c: number, d: number, tx: number, ty: number,
        red: number, green: number, blue: number, alpha: number
    ): number;
    // 経路を [本数, 要素数, x, y, 制御点か, ..., 要素数, ...] で返す。経路は空になる
    exportPath (stroke: boolean): Float64Array;
    // 経路を空にする
    reset (): void;
}

/**
 * @type {INativeShape | null}
 * @public
 */
export const $nativeShape: INativeShape | null =
    (globalThis as unknown as { __next2dShape?: INativeShape }).__next2dShape || null;

/**
 * @description 経路を実行環境の側で組み立てている最中かどうか。
 *              true の間、JavaScript 側の経路 ($currentPath / $vertices) は空。
 *              Whether the path is currently being built on the runtime side. While true, the
 *              JavaScript-side path ($currentPath / $vertices) is empty.
 *
 * @type {boolean}
 * @public
 */
export let $nativePathActive: boolean = false;

/**
 * @param  {boolean} active
 * @return {void}
 * @method
 * @public
 */
export const $setNativePathActive = (active: boolean): void =>
{
    $nativePathActive = active;
};
