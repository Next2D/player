/**
 * @description ピクセルデータからテクスチャを作成
 *              Create texture from pixel data
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {Map<string, GPUTexture>} textures - テクスチャ管理マップ
 * @param  {string} name - テクスチャ名
 * @param  {Uint8Array} pixels - ピクセルデータ
 * @param  {number} width - テクスチャ幅
 * @param  {number} height - テクスチャ高さ
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
        "size": { width, height },
        "format": "rgba8unorm",
        "usage": GPUTextureUsage.TEXTURE_BINDING |
               GPUTextureUsage.COPY_DST |
               GPUTextureUsage.RENDER_ATTACHMENT
    });

    device.queue.writeTexture(
        { texture },
        pixels.buffer,
        { "bytesPerRow": width * 4, "offset": pixels.byteOffset },
        { width, height }
    );

    textures.set(name, texture);
    return texture;
};
