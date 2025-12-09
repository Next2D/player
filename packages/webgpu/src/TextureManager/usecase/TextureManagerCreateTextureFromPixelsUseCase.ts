/**
 * @description ピクセルデータからテクスチャを作成
 *              Create texture from pixel data
 *
 * @param  {GPUDevice} device
 * @param  {Map<string, GPUTexture>} textures
 * @param  {string} name
 * @param  {Uint8Array} pixels
 * @param  {number} width
 * @param  {number} height
 * @return {GPUTexture}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    textures: Map<string, GPUTexture>,
    name: string,
    pixels: Uint8Array,
    width: number,
    height: number
): GPUTexture => {
    const texture = device.createTexture({
        size: { width, height },
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING |
               GPUTextureUsage.COPY_DST |
               GPUTextureUsage.RENDER_ATTACHMENT
    });

    device.queue.writeTexture(
        { texture },
        pixels.buffer,
        { bytesPerRow: width * 4, offset: pixels.byteOffset },
        { width, height }
    );

    textures.set(name, texture);
    return texture;
};
