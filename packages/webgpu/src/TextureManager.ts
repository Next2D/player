import type { ITextureObject } from "./interface/ITextureObject";

/**
 * @description 現在のアクティブなテクスチャーの番号
 *              Number of the currently binded active texture
 *
 * @type {number}
 * @protected
 */
export let $activeTextureUnit: number = -1;

/**
 * @description アクティブなテクスチャユニットを設定
 *              Set the active texture unit
 *
 * @param {number} unit
 * @return {void}
 * @method
 * @protected
 */
export const $setActiveTextureUnit = (unit: number): void =>
{
    $activeTextureUnit = unit;
};

/**
 * @description 現在bindされてるテクスチャの配列
 *              Array of currently bound textures
 *
 * @type {Array}
 * @protected
 */
export const $boundTextures: Array<ITextureObject | null> = [null, null, null];

/**
 * @description テクスチャIDカウンター
 *              Texture ID counter
 *
 * @type {number}
 * @protected
 */
let $textureId: number = 0;

/**
 * @description WebGPUテクスチャオブジェクトを作成
 *              Create WebGPU texture object
 *
 * @param  {GPUDevice} device
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} [smooth=true]
 * @param  {GPUTextureFormat} [format="rgba8unorm"]
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const $createTextureObject = (
    device: GPUDevice,
    width: number,
    height: number,
    smooth: boolean = true,
    format: GPUTextureFormat = "rgba8unorm"
): ITextureObject =>
{
    const texture = device.createTexture({
        "size": { width, height },
        format,
        "usage": GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });

    return {
        "id": $textureId++,
        "resource": texture,
        width,
        height,
        "area": width * height,
        smooth
    };
};

/**
 * @description テクスチャをバインド
 *              Bind texture
 *
 * @param  {ITextureObject} textureObject
 * @param  {number} unit
 * @return {void}
 * @method
 * @protected
 */
export const $bindTexture = (textureObject: ITextureObject, unit: number): void =>
{
    if ($boundTextures[unit] === textureObject) {
        return;
    }

    $boundTextures[unit] = textureObject;
    $activeTextureUnit = unit;
};

/**
 * @description テクスチャのバインドを解除
 *              Unbind texture
 *
 * @param  {number} unit
 * @return {void}
 * @method
 * @protected
 */
export const $unbindTexture = (unit: number): void =>
{
    $boundTextures[unit] = null;
};

/**
 * @description 全てのテクスチャのバインドを解除
 *              Unbind all textures
 *
 * @return {void}
 * @method
 * @protected
 */
export const $unbindAllTextures = (): void =>
{
    for (let i = 0; i < $boundTextures.length; i++) {
        $boundTextures[i] = null;
    }
    $activeTextureUnit = -1;
};

/**
 * @description テクスチャを削除
 *              Delete texture
 *
 * @param  {ITextureObject} textureObject
 * @return {void}
 * @method
 * @protected
 */
export const $deleteTexture = (textureObject: ITextureObject): void =>
{
    // WebGPUではテクスチャの削除はGCに任せる
    // WebGPU textures are deleted by GC

    // バインドされている場合は解除
    // Unbind if bound
    for (let i = 0; i < $boundTextures.length; i++) {
        if ($boundTextures[i] === textureObject) {
            $boundTextures[i] = null;
        }
    }

    textureObject.resource.destroy();
};