import type { IFilterConfig } from "../../interface/IFilterConfig";

/**
 * @description フレーム共有領域へUniformをコピーし、静的offset/size付きbindingを返す。
 *              Stage uniforms in the frame arena, or upload independently for standalone callers.
 *              The caller must flush the arena before submit and retain buffers until submit.
 * @param {GPUDevice} device
 * @param {Float32Array} data
 * @param {IFilterConfig["bufferManager"]} [buffer_manager]
 * @return {GPUBufferBinding}
 */
export const execute = (
    device: GPUDevice,
    data: Float32Array,
    buffer_manager?: IFilterConfig["bufferManager"]
): GPUBufferBinding => {
    if (buffer_manager) {
        return buffer_manager.allocateUniformBinding(data);
    }
    const buffer = device.createBuffer({
        "size": data.byteLength,
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(buffer, 0, data);
    return { buffer, "offset": 0, "size": data.byteLength };
};
