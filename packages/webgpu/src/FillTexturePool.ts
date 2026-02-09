// GPUTextureUsage.TEXTURE_BINDING(0x04) | GPUTextureUsage.COPY_DST(0x02) = 0x06
const FILL_TEXTURE_USAGE = 0x06;

const $pool: Map<string, GPUTexture[]> = new Map();

export const $acquireFillTexture = (device: GPUDevice, width: number, height: number): GPUTexture =>
{
    const key = `${width}_${height}`;
    const list = $pool.get(key);
    if (list && list.length > 0) {
        return list.pop()!;
    }
    return device.createTexture({
        "size": { width, height },
        "format": "rgba8unorm",
        "usage": FILL_TEXTURE_USAGE
    });
};

export const $releaseFillTexture = (texture: GPUTexture): void =>
{
    const key = `${texture.width}_${texture.height}`;
    let list = $pool.get(key);
    if (!list) {
        list = [];
        $pool.set(key, list);
    }
    list.push(texture);
};

export const $clearFillTexturePool = (): void =>
{
    for (const [, list] of $pool) {
        for (const texture of list) {
            texture.destroy();
        }
    }
    $pool.clear();
};
