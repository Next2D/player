/**
 * @description レンダーパス記述子を作成
 *              Create render pass descriptor
 *
 * @param  {GPUTextureView} view
 * @param  {number} r
 * @param  {number} g
 * @param  {number} b
 * @param  {number} a
 * @param  {GPULoadOp} loadOp
 * @return {GPURenderPassDescriptor}
 * @method
 * @protected
 */
export const execute = (
    view: GPUTextureView,
    r: number = 0,
    g: number = 0,
    b: number = 0,
    a: number = 0,
    loadOp: GPULoadOp = "clear"
): GPURenderPassDescriptor => {
    return {
        colorAttachments: [{
            view: view,
            clearValue: { r, g, b, a },
            loadOp: loadOp,
            storeOp: "store"
        }]
    };
};
