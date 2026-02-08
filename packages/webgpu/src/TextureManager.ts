import { execute as textureManagerInitializeSamplersService } from "./TextureManager/service/TextureManagerInitializeSamplersService";
import { execute as textureManagerCreateTextureFromPixelsUseCase } from "./TextureManager/usecase/TextureManagerCreateTextureFromPixelsUseCase";
import { execute as textureManagerCreateTextureFromImageBitmapUseCase } from "./TextureManager/usecase/TextureManagerCreateTextureFromImageBitmapUseCase";

export class TextureManager
{
    private device: GPUDevice;
    private textures: Map<string, GPUTexture>;
    private samplers: Map<string, GPUSampler>;

    constructor (device: GPUDevice)
    {
        this.device = device;
        this.textures = new Map();
        this.samplers = new Map();

        textureManagerInitializeSamplersService(device, this.samplers);
    }

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

    createTextureFromPixels (
        name: string,
        pixels: Uint8Array,
        width: number,
        height: number
    ): GPUTexture {
        return textureManagerCreateTextureFromPixelsUseCase(
            this.device,
            this.textures,
            name,
            pixels,
            width,
            height
        );
    }

    createTextureFromImageBitmap (name: string, imageBitmap: ImageBitmap): GPUTexture
    {
        return textureManagerCreateTextureFromImageBitmapUseCase(
            this.device,
            this.textures,
            name,
            imageBitmap
        );
    }

    updateTexture (
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
                { "bytesPerRow": width * 4, "offset": pixels.byteOffset },
                { width, height }
            );
        }
    }

    getTexture (name: string): GPUTexture | undefined
    {
        return this.textures.get(name);
    }

    getSampler (name: string): GPUSampler | undefined
    {
        return this.samplers.get(name);
    }

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

    destroyTexture (name: string): void
    {
        const texture = this.textures.get(name);
        if (texture) {
            texture.destroy();
            this.textures.delete(name);
        }
    }

    dispose (): void
    {
        for (const texture of this.textures.values()) {
            texture.destroy();
        }
        this.textures.clear();
        this.samplers.clear();
    }
}
