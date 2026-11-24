/**
 * @description 図形の塗り 1 つ分の「ステンシルに形を描く → 色を塗る」を 1 回で行う、実行環境の関数を持つ
 *              レンダーパス。ブラウザには無く、JavaScript の実行が遅い環境 (ゲーム機など) の実行環境が
 *              レンダーパスに __next2dStencilFill として置く。次の呼び出しを順に行うのと同じ結果になる:
 *                setPipeline(write_pipeline); setStencilReference(0); setVertexBuffer(0, vertex_buffer);
 *                setBindGroup(0, bind_group, [uniform_offset]); draw(vertex_count, 1, 0, 0);
 *                setPipeline(fill_pipeline); setStencilReference(0);
 *                setBindGroup(0, bind_group, [uniform_offset]); draw(vertex_count, 1, 0, 0);
 *              A render pass with a function of the runtime that performs "draw the shape into the
 *              stencil, then paint the color" of one fill in a single call. Browsers do not have
 *              it; runtimes where JavaScript runs slowly (such as game consoles) put it on the
 *              render pass as __next2dStencilFill. The result is the same as the calls above.
 */
export interface INativeStencilFillPass {
    __next2dStencilFill (
        write_pipeline: GPURenderPipeline,
        fill_pipeline: GPURenderPipeline,
        vertex_buffer: GPUBuffer,
        bind_group: GPUBindGroup,
        uniform_offset: number,
        vertex_count: number
    ): void;
}

/**
 * @description 実行環境が __next2dStencilFill を持つか (0: 未確認、1: 持つ、2: 持たない)。
 *              レンダーパスが手に入るまで分からないので、最初の塗りで確かめる。
 *              Whether the runtime provides __next2dStencilFill (0: unknown, 1: yes, 2: no).
 *              It cannot be known until a render pass exists, so the first fill checks it.
 *
 * @type {number}
 * @protected
 */
export let $nativeStencilFill: number = 0;

/**
 * @description レンダーパスを見て、$nativeStencilFill を確定する
 *              Settle $nativeStencilFill by looking at a render pass
 *
 * @param  {GPURenderPassEncoder} render_pass_encoder
 * @return {void}
 * @method
 * @protected
 */
export const $detectNativeStencilFill = (render_pass_encoder: GPURenderPassEncoder): void =>
{
    $nativeStencilFill = typeof (
        render_pass_encoder as unknown as Partial<INativeStencilFillPass>
    ).__next2dStencilFill === "function" ? 1 : 2;
};
