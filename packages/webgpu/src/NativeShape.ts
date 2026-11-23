import type { IPath } from "./interface/IPath";

/**
 * @description 実行環境が提供する、図形の「経路の組み立て」と「塗りのメッシュの生成」の実装 (WebGPU 用)。
 *              JIT が使えない実行環境 (ゲーム機向けのホスト) が、グローバルの __next2dShape.webgpu に置く。
 *              無い環境 (ブラウザ) では null で、すべて JavaScript で処理する。結果はどちらも同じ。
 *
 *              The implementation of path building and fill mesh generation provided by the runtime
 *              (for WebGPU). Runtimes without a JIT (hosts for game consoles) put it on the global
 *              as __next2dShape.webgpu. Where it is absent (browsers) this is null and everything
 *              runs in JavaScript. Both produce the same result.
 */
export interface INativeShape {
    // commands[index] から続く経路の命令をまとめて処理し、経路でない命令の位置を返す
    path (commands: Float32Array, index: number, pixel_scale: number): number;
    // いまの経路を塗りのメッシュにしたときの要素数。経路が 1 本も無ければ -1
    fillSize (): number;
    // メッシュ (頂点あたり 4 要素) を target の先頭から書き、頂点数を返す。経路は残る
    fill (target: Float32Array): number;
    // 経路を [本数, 要素数, x, y, 制御点か, ..., 要素数, ...] で返す。経路は残る
    exportPath (stroke: boolean): Float64Array;
    // 経路を空にする
    reset (): void;
}

/**
 * @type {INativeShape | null}
 * @public
 */
export const $nativeShape: INativeShape | null =
    (globalThis as unknown as { __next2dShape?: { webgpu?: INativeShape } }).__next2dShape?.webgpu || null;

/**
 * @description 経路が実行環境の側にあることを表す目印。PathCommand.$getVertices がこれを返したら、
 *              MeshFillGenerateUseCase はメッシュを実行環境の側で作る。中身は使わない。
 *              A marker meaning that the path lives on the runtime side. When PathCommand.$getVertices
 *              returns it, MeshFillGenerateUseCase generates the mesh on the runtime side. Its content
 *              is not used.
 *
 * @type {IPath[]}
 * @public
 */
export const $NATIVE_FILL_PATH: IPath[] = [[]];

/**
 * @description $NATIVE_FILL_PATH を返したときの、塗りのメッシュの要素数
 *              Element count of the fill mesh at the time $NATIVE_FILL_PATH was returned
 *
 * @type {number}
 * @public
 */
export let $nativeFillSize: number = 0;

/**
 * @param  {number} size
 * @return {void}
 * @method
 * @public
 */
export const $setNativeFillSize = (size: number): void =>
{
    $nativeFillSize = size;
};
