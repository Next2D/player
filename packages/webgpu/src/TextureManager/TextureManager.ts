import type { ITextureObject } from "../interface/ITextureObject";
import { $device, $upperPowerOfTwo } from "../WebGPUUtil";

/**
 * @description WebGPU版、テクスチャマネージャー
 *              WebGPU version, Texture manager
 *
 * @class
 * @public
 */
export class TextureManager
{
    /**
     * @description テクスチャオブジェクトのプール
     *              Pool of texture objects
     *
     * @type {ITextureObject[]}
     * @private
     */
    private static readonly _$texturePool: ITextureObject[] = [];

    /**
     * @description 使用中のテクスチャオブジェクト
     *              Active texture objects
     *
     * @type {Map<number, ITextureObject>}
     * @private
     */
    private static readonly _$activeTextures: Map<number, ITextureObject> = new Map();

    /**
     * @description テクスチャIDカウンター
     *              Texture ID counter
     *
     * @type {number}
     * @private
     */
    private static _$textureIdCounter: number = 0;

    /**
     * @description 指定されたサイズのテクスチャを取得または作成
     *              Get or create texture with specified size
     *
     * @param  {number} width
     * @param  {number} height
     * @param  {GPUTextureFormat} [format="rgba8unorm"]
     * @param  {boolean} [smooth=true]
     * @return {ITextureObject}
     * @method
     * @public
     * @static
     */
    static getTexture (
        width: number,
        height: number,
        format: GPUTextureFormat = "rgba8unorm",
        smooth: boolean = true
    ): ITextureObject {

        // Round up to power of two for better GPU compatibility
        const actualWidth = $upperPowerOfTwo(width);
        const actualHeight = $upperPowerOfTwo(height);
        const area = actualWidth * actualHeight;

        // Try to find a suitable texture from the pool
        for (let i = 0; i < TextureManager._$texturePool.length; i++) {
            const textureObject = TextureManager._$texturePool[i];
            if (textureObject.width === actualWidth &&
                textureObject.height === actualHeight &&
                textureObject.smooth === smooth) {

                // Remove from pool and add to active
                TextureManager._$texturePool.splice(i, 1);
                TextureManager._$activeTextures.set(textureObject.id, textureObject);
                return textureObject;
            }
        }

        // Create new texture if none found in pool
        const texture = $device.createTexture({
            "size": {
                "width": actualWidth,
                "height": actualHeight,
                "depthOrArrayLayers": 1
            },
            "format": format,
            "usage": GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.RENDER_ATTACHMENT
        });

        const textureObject: ITextureObject = {
            "id": ++TextureManager._$textureIdCounter,
            "resource": texture,
            "width": actualWidth,
            "height": actualHeight,
            "area": area,
            "smooth": smooth
        };

        TextureManager._$activeTextures.set(textureObject.id, textureObject);
        return textureObject;
    }

    /**
     * @description テクスチャオブジェクトをプールに戻す
     *              Return texture object to pool
     *
     * @param  {ITextureObject} texture_object
     * @return {void}
     * @method
     * @public
     * @static
     */
    static releaseTexture (texture_object: ITextureObject): void
    {
        // Remove from active textures
        TextureManager._$activeTextures.delete(texture_object.id);

        // Add to pool if not too many pooled textures
        if (TextureManager._$texturePool.length < 50) {
            TextureManager._$texturePool.push(texture_object);
        } else {
            // Destroy texture if pool is full
            texture_object.resource.destroy();
        }
    }

    /**
     * @description ImageBitmapからテクスチャを作成
     *              Create texture from ImageBitmap
     *
     * @param  {ImageBitmap} image_bitmap
     * @param  {boolean} [smooth=true]
     * @return {ITextureObject}
     * @method
     * @public
     * @static
     */
    static createTextureFromImageBitmap (image_bitmap: ImageBitmap, smooth: boolean = true): ITextureObject
    {
        const textureObject = TextureManager.getTexture(
            image_bitmap.width,
            image_bitmap.height,
            "rgba8unorm",
            smooth
        );

        // Copy image data to texture
        $device.queue.copyExternalImageToTexture(
            { "source": image_bitmap },
            { "texture": textureObject.resource },
            {
                "width": image_bitmap.width,
                "height": image_bitmap.height,
                "depthOrArrayLayers": 1
            }
        );

        return textureObject;
    }

    /**
     * @description ArrayBufferからテクスチャを作成
     *              Create texture from ArrayBuffer
     *
     * @param  {ArrayBuffer} data
     * @param  {number} width
     * @param  {number} height
     * @param  {GPUTextureFormat} [format="rgba8unorm"]
     * @param  {boolean} [smooth=true]
     * @return {ITextureObject}
     * @method
     * @public
     * @static
     */
    static createTextureFromArrayBuffer (
        data: ArrayBuffer,
        width: number,
        height: number,
        format: GPUTextureFormat = "rgba8unorm",
        smooth: boolean = true
    ): ITextureObject {

        const textureObject = TextureManager.getTexture(width, height, format, smooth);

        // Calculate bytes per pixel based on format
        let bytesPerPixel = 4; // Default for rgba8unorm
        if (format.includes("rgb8")) {
            bytesPerPixel = 3;
        } else if (format.includes("rg8")) {
            bytesPerPixel = 2;
        } else if (format.includes("r8")) {
            bytesPerPixel = 1;
        }

        // Copy data to texture
        $device.queue.writeTexture(
            { "texture": textureObject.resource },
            data,
            {
                "bytesPerRow": width * bytesPerPixel,
                "rowsPerImage": height
            },
            {
                "width": width,
                "height": height,
                "depthOrArrayLayers": 1
            }
        );

        return textureObject;
    }

    /**
     * @description テクスチャにサンプラーを作成
     *              Create sampler for texture
     *
     * @param  {boolean} [smooth=true]
     * @param  {GPUAddressMode} [address_mode="clamp-to-edge"]
     * @return {GPUSampler}
     * @method
     * @public
     * @static
     */
    static createSampler (
        smooth: boolean = true,
        address_mode: GPUAddressMode = "clamp-to-edge"
    ): GPUSampler {

        return $device.createSampler({
            "magFilter": smooth ? "linear" : "nearest",
            "minFilter": smooth ? "linear" : "nearest",
            "addressModeU": address_mode,
            "addressModeV": address_mode
        });
    }

    /**
     * @description 全てのテクスチャを破棄
     *              Destroy all textures
     *
     * @return {void}
     * @method
     * @public
     * @static
     */
    static destroyAll (): void
    {
        // Destroy active textures
        for (const textureObject of TextureManager._$activeTextures.values()) {
            textureObject.resource.destroy();
        }
        TextureManager._$activeTextures.clear();

        // Destroy pooled textures
        for (const textureObject of TextureManager._$texturePool) {
            textureObject.resource.destroy();
        }
        TextureManager._$texturePool.length = 0;

        // Reset counter
        TextureManager._$textureIdCounter = 0;
    }

    /**
     * @description アクティブなテクスチャ数を取得
     *              Get number of active textures
     *
     * @return {number}
     * @method
     * @public
     * @static
     */
    static get activeTextureCount (): number
    {
        return TextureManager._$activeTextures.size;
    }

    /**
     * @description プールされたテクスチャ数を取得
     *              Get number of pooled textures
     *
     * @return {number}
     * @method
     * @public
     * @static
     */
    static get pooledTextureCount (): number
    {
        return TextureManager._$texturePool.length;
    }
}