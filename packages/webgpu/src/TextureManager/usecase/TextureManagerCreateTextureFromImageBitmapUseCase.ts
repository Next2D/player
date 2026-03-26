/**
 * @description ImageBitmapからテクスチャを作成
 *              Create texture from ImageBitmap
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {Map<string, GPUTexture>} textures - テクスチャ管理マップ
 * @param  {string} name - テクスチャ名
 * @param  {ImageBitmap} image_bitmap - 画像ビットマップ
 * @return {GPUTexture}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    textures: Map<string, GPUTexture>,
    name: string,
    image_bitmap: ImageBitmap
): GPUTexture => {
    const texture = device.createTexture({
        "size": { "width": image_bitmap.width, "height": image_bitmap.height },
        "format": "rgba8unorm",
        "usage": GPUTextureUsage.TEXTURE_BINDING |
               GPUTextureUsage.COPY_DST |
               GPUTextureUsage.RENDER_ATTACHMENT
    });

    device.queue.copyExternalImageToTexture(
        {
            "source": image_bitmap,
            "flipY": true
        },
        {
            texture,
            "premultipliedAlpha": true
        },
        { "width": image_bitmap.width, "height": image_bitmap.height }
    );

    textures.set(name, texture);
    return texture;
};
