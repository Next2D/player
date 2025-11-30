/**
 * @description WebGPUテクスチャマネージャー
 *              WebGPU texture manager
 */
export class TextureManager
{
    private device: GPUDevice;
    private textures: Map<string, GPUTexture>;
    private samplers: Map<string, GPUSampler>;

    /**
     * @param {GPUDevice} device
     * @constructor
     */
    constructor(device: GPUDevice)
    {
        this.device = device;
        this.textures = new Map();
        this.samplers = new Map();
        
        this.initializeSamplers();
    }

    /**
     * @description サンプラーを初期化
     * @return {void}
     */
    private initializeSamplers(): void
    {
        // デフォルトサンプラー（リニアフィルタリング）
        const linearSampler = this.device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
            mipmapFilter: "linear",
            addressModeU: "clamp-to-edge",
            addressModeV: "clamp-to-edge"
        });
        this.samplers.set("linear", linearSampler);

        // ニアレストサンプラー
        const nearestSampler = this.device.createSampler({
            magFilter: "nearest",
            minFilter: "nearest",
            mipmapFilter: "nearest",
            addressModeU: "clamp-to-edge",
            addressModeV: "clamp-to-edge"
        });
        this.samplers.set("nearest", nearestSampler);

        // リピートサンプラー
        const repeatSampler = this.device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
            mipmapFilter: "linear",
            addressModeU: "repeat",
            addressModeV: "repeat"
        });
        this.samplers.set("repeat", repeatSampler);
    }

    /**
     * @description テクスチャを作成
     * @param {string} name
     * @param {number} width
     * @param {number} height
     * @param {GPUTextureFormat} format
     * @return {GPUTexture}
     */
    createTexture(
        name: string,
        width: number,
        height: number,
        format: GPUTextureFormat = "rgba8unorm"
    ): GPUTexture {
        const texture = this.device.createTexture({
            size: { width, height },
            format: format,
            usage: GPUTextureUsage.TEXTURE_BINDING |
                   GPUTextureUsage.COPY_DST |
                   GPUTextureUsage.RENDER_ATTACHMENT
        });

        this.textures.set(name, texture);
        return texture;
    }

    /**
     * @description ピクセルデータからテクスチャを作成
     * @param {string} name
     * @param {Uint8Array} pixels
     * @param {number} width
     * @param {number} height
     * @return {GPUTexture}
     */
    createTextureFromPixels(
        name: string,
        pixels: Uint8Array,
        width: number,
        height: number
    ): GPUTexture {
        const texture = this.createTexture(name, width, height);

        this.device.queue.writeTexture(
            { texture },
            pixels.buffer,
            { bytesPerRow: width * 4, offset: pixels.byteOffset },
            { width, height }
        );

        return texture;
    }

    /**
     * @description ImageBitmapからテクスチャを作成
     * @param {string} name
     * @param {ImageBitmap} imageBitmap
     * @return {GPUTexture}
     */
    createTextureFromImageBitmap(name: string, imageBitmap: ImageBitmap): GPUTexture
    {
        const texture = this.createTexture(
            name,
            imageBitmap.width,
            imageBitmap.height
        );

        this.device.queue.copyExternalImageToTexture(
            { 
                source: imageBitmap,
                flipY: false
            },
            { 
                texture,
                premultipliedAlpha: true
            },
            { width: imageBitmap.width, height: imageBitmap.height }
        );

        return texture;
    }

    /**
     * @description テクスチャを更新
     * @param {string} name
     * @param {Uint8Array} pixels
     * @param {number} width
     * @param {number} height
     * @return {void}
     */
    updateTexture(
        name: string,
        pixels: Uint8Array,
        width: number,
        height: number
    ): void {
        const texture = this.textures.get(name);
        if (texture) {
            this.device.queue.writeTexture(
                { texture },
                pixels.buffer,
                { bytesPerRow: width * 4, offset: pixels.byteOffset },
                { width, height }
            );
        }
    }

    /**
     * @description テクスチャを取得
     * @param {string} name
     * @return {GPUTexture | undefined}
     */
    getTexture(name: string): GPUTexture | undefined
    {
        return this.textures.get(name);
    }

    /**
     * @description サンプラーを取得
     * @param {string} name
     * @return {GPUSampler | undefined}
     */
    getSampler(name: string): GPUSampler | undefined
    {
        return this.samplers.get(name);
    }

    /**
     * @description サンプラーを作成（存在する場合は既存のものを返す）
     * @param {string} name
     * @param {boolean} smooth
     * @return {GPUSampler}
     */
    createSampler(name: string, smooth: boolean = true): GPUSampler
    {
        const existing = this.samplers.get(name);
        if (existing) {
            return existing;
        }

        const sampler = this.device.createSampler({
            magFilter: smooth ? "linear" : "nearest",
            minFilter: smooth ? "linear" : "nearest",
            mipmapFilter: smooth ? "linear" : "nearest",
            addressModeU: "clamp-to-edge",
            addressModeV: "clamp-to-edge"
        });

        this.samplers.set(name, sampler);
        return sampler;
    }

    /**
     * @description テクスチャを解放
     * @param {string} name
     * @return {void}
     */
    destroyTexture(name: string): void
    {
        const texture = this.textures.get(name);
        if (texture) {
            texture.destroy();
            this.textures.delete(name);
        }
    }

    /**
     * @description すべてのリソースを解放
     * @return {void}
     */
    dispose(): void
    {
        for (const texture of this.textures.values()) {
            texture.destroy();
        }
        this.textures.clear();
        this.samplers.clear();
    }
}
