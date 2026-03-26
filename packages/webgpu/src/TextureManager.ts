import { execute as textureManagerInitializeSamplersService } from "./TextureManager/service/TextureManagerInitializeSamplersService";

/**
 * @description テクスチャとサンプラーの管理クラス
 *              Manager class for textures and samplers
 */
export class TextureManager
{
    private device: GPUDevice;
    private textures: Map<string, GPUTexture>;
    private samplers: Map<string, GPUSampler>;

    /**
     * @description TextureManagerのコンストラクタ
     *              Constructor for TextureManager
     * @param {GPUDevice} device - WebGPUデバイス / WebGPU device
     */
    constructor (device: GPUDevice)
    {
        this.device = device;
        this.textures = new Map();
        this.samplers = new Map();

        textureManagerInitializeSamplersService(device, this.samplers);
    }

    /**
     * @description 新しいGPUテクスチャを作成する
     *              Create a new GPU texture
     * @param  {string}           name   - テクスチャ名 / Texture name
     * @param  {number}           width  - テクスチャの幅 / Texture width
     * @param  {number}           height - テクスチャの高さ / Texture height
     * @param  {GPUTextureFormat} [format="rgba8unorm"] - テクスチャフォーマット / Texture format
     * @return {GPUTexture}
     */
    createTexture (
        name: string,
        width: number,
        height: number,
        format: GPUTextureFormat = "rgba8unorm"
    ): GPUTexture {
        const texture = this.device.createTexture({
            "size": { width, height },
            "format": format,
            "usage": GPUTextureUsage.TEXTURE_BINDING |
                   GPUTextureUsage.COPY_DST |
                   GPUTextureUsage.RENDER_ATTACHMENT
        });

        this.textures.set(name, texture);
        return texture;
    }

    /**
     * @description 名前でテクスチャを取得する
     *              Get a texture by name
     * @param  {string} name - テクスチャ名 / Texture name
     * @return {GPUTexture | undefined}
     */
    getTexture (name: string): GPUTexture | undefined
    {
        return this.textures.get(name);
    }

    /**
     * @description サンプラーを作成する（既存の場合は返却）
     *              Create a sampler (returns existing if found)
     * @param  {string}  name            - サンプラー名 / Sampler name
     * @param  {boolean} [smooth=true]   - スムージングを有効にするか / Whether to enable smoothing
     * @return {GPUSampler}
     */
    createSampler (name: string, smooth: boolean = true): GPUSampler
    {
        const existing = this.samplers.get(name);
        if (existing) {
            return existing;
        }

        const sampler = this.device.createSampler({
            "magFilter": smooth ? "linear" : "nearest",
            "minFilter": smooth ? "linear" : "nearest",
            "mipmapFilter": smooth ? "linear" : "nearest",
            "addressModeU": "clamp-to-edge",
            "addressModeV": "clamp-to-edge"
        });

        this.samplers.set(name, sampler);
        return sampler;
    }

    /**
     * @description 全テクスチャとサンプラーを破棄する
     *              Dispose all textures and samplers
     * @return {void}
     */
    dispose (): void
    {
        for (const texture of this.textures.values()) {
            texture.destroy();
        }
        this.textures.clear();
        this.samplers.clear();
    }
}
