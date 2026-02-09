// GPUTexture → GPUTextureView キャッシュ（createView()呼び出し削減）
const $viewCache = new WeakMap<GPUTexture, GPUTextureView>();

export const $getOrCreateView = (texture: GPUTexture): GPUTextureView => {
    let view = $viewCache.get(texture);
    if (!view) {
        view = texture.createView();
        $viewCache.set(texture, view);
    }
    return view;
};

// GPUTextureUsage.TEXTURE_BINDING(0x04) | GPUTextureUsage.COPY_DST(0x02) = 0x06
const FILL_TEXTURE_USAGE = 0x06;

// GPUTextureUsage.TEXTURE_BINDING(0x04) | GPUTextureUsage.COPY_DST(0x02) | GPUTextureUsage.RENDER_ATTACHMENT(0x10) = 0x16
const RENDER_TEXTURE_USAGE = 0x16;

const $pool: Map<string, GPUTexture[]> = new Map();
const $renderPool: Map<string, GPUTexture[]> = new Map();

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

export const $acquireRenderTexture = (device: GPUDevice, width: number, height: number): GPUTexture =>
{
    const key = `${width}_${height}`;
    const list = $renderPool.get(key);
    if (list && list.length > 0) {
        return list.pop()!;
    }
    return device.createTexture({
        "size": { width, height },
        "format": "rgba8unorm",
        "usage": RENDER_TEXTURE_USAGE
    });
};

export const $releaseRenderTexture = (texture: GPUTexture): void =>
{
    const key = `${texture.width}_${texture.height}`;
    let list = $renderPool.get(key);
    if (!list) {
        list = [];
        $renderPool.set(key, list);
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

    for (const [, list] of $renderPool) {
        for (const texture of list) {
            texture.destroy();
        }
    }
    $renderPool.clear();
};
