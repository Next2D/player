import type { IGradientLUTSlot } from "../interface/IGradientLUTSlot";
import type { IAttachmentObject } from "../interface/IAttachmentObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as frameBufferManagerCreateAttachmentObjectService } from "../FrameBufferManager/service/FrameBufferManagerCreateAttachmentObjectService";
import { execute as textureManagerGetTextureUseCase } from "../TextureManager/usecase/TextureManagerGetTextureUseCase";

/**
 * @description 図形のグラデーション LUT を保持する枠の数 (解像度ごと)。
 *              LUT は 1 行のテクスチャ (幅 256 / 512 / 1024) なので、枠を増やしてもメモリはわずか。
 *              The number of slots holding shape gradient LUTs (per resolution). A LUT is a one-row
 *              texture (256 / 512 / 1024 wide), so the slots cost very little memory.
 *
 * @type {number}
 * @const
 */
export const $GRADIENT_LUT_SLOT_COUNT: number = 32;

/**
 * @description 解像度ごとの LUT の枠
 *              LUT slots by resolution
 *
 * @type {Map<number, IGradientLUTSlot[]>}
 * @private
 */
const $slots: Map<number, IGradientLUTSlot[]> = new Map();

/**
 * @description 解像度ごとの、次に上書きする枠の位置
 *              The position of the next slot to overwrite, by resolution
 *
 * @type {Map<number, number>}
 * @private
 */
const $cursors: Map<number, number> = new Map();

/**
 * @description まとめて LUT を用意する処理の通し番号。同じ回で割り当てた枠を、その回のうちに
 *              上書きしないために使う。
 *              Serial number of the batched LUT preparation. Used so that a slot assigned in a pass
 *              is not overwritten within that pass.
 *
 * @type {number}
 * @private
 */
let $pass: number = 0;

/**
 * @description 通し番号を進めて返却
 *              Advance and return the serial number
 *
 * @return {number}
 * @method
 * @protected
 */
export const $nextGradientLUTPass = (): number =>
{
    return ++$pass;
};

/**
 * @description stops と補間方法からハッシュ値を計算
 *              Compute a hash from the stops and the interpolation
 *
 * @param  {array} stops
 * @param  {number} interpolation
 * @return {number}
 * @method
 * @protected
 */
export const $hashGradientStops = (stops: number[], interpolation: number): number =>
{
    let hash = interpolation | 0;
    for (let idx = 0; idx < stops.length; ++idx) {
        hash = Math.imul(hash, 31) + (stops[idx] * 1024 | 0) | 0;
    }
    return hash;
};

/**
 * @description 同じ stops・補間方法の LUT を持つ枠を返却 (無ければ null)
 *              Return the slot holding the LUT of the same stops and interpolation (null if none)
 *
 * @param  {number} resolution
 * @param  {array} stops
 * @param  {number} interpolation
 * @param  {number} hash
 * @return {IGradientLUTSlot | null}
 * @method
 * @protected
 */
export const $findGradientLUTSlot = (
    resolution: number,
    stops: number[],
    interpolation: number,
    hash: number
): IGradientLUTSlot | null => {

    const slots = $slots.get(resolution);
    if (!slots) {
        return null;
    }

    const length = stops.length;
    for (let idx = 0; idx < slots.length; ++idx) {

        const slot = slots[idx];
        if (slot.hash !== hash
            || slot.length !== length
            || slot.interpolation !== interpolation
        ) {
            continue;
        }

        // ハッシュ値が同じでも中身が違うことがあるので、値を比べる
        const values = slot.stops;
        let same = true;
        for (let i = 0; i < length; ++i) {
            if (values[i] !== stops[i]) {
                same = false;
                break;
            }
        }

        if (same) {
            return slot;
        }
    }

    return null;
};

/**
 * @description 枠の描画先を作成。LUT の描画はステンシルを使わないので、同じ解像度の枠は
 *              ステンシルバッファを共有する (枠ごとに作ると、初めて使うときの確保と付け替えが
 *              枠の数だけ走る。共有すれば、枠を切り替えてもテクスチャの付け替えだけで済む)。
 *              Create the render target of a slot. Drawing a LUT does not use the stencil, so the
 *              slots of one resolution share a stencil buffer (one per slot would allocate and
 *              attach as many buffers on first use; sharing leaves only the texture to re-attach
 *              when switching between slots).
 *
 * @param  {number} resolution
 * @param  {IAttachmentObject | null} shared
 * @return {IAttachmentObject}
 * @method
 * @private
 */
const $createAttachment = (
    resolution: number,
    shared: IAttachmentObject | null
): IAttachmentObject => {

    if (!shared) {
        return frameBufferManagerGetAttachmentObjectUseCase(resolution, 1, false);
    }

    const attachment = frameBufferManagerCreateAttachmentObjectService();
    attachment.width   = resolution;
    attachment.height  = 1;
    attachment.texture = textureManagerGetTextureUseCase(resolution, 1);
    attachment.stencil = shared.stencil;

    return attachment;
};

/**
 * @description 新しい LUT を描く枠を返却。空きが無ければ古い枠を順に上書きする。
 *              protect_pass の回で割り当てた枠は上書きしない (全部がその回の枠なら null)。
 *              Return a slot to draw a new LUT into. When none is free, old slots are overwritten in
 *              turn. Slots assigned in the pass protect_pass are never overwritten (null when every
 *              slot belongs to that pass).
 *
 * @param  {number} resolution
 * @param  {number} protect_pass
 * @return {IGradientLUTSlot | null}
 * @method
 * @protected
 */
export const $takeGradientLUTSlot = (
    resolution: number,
    protect_pass: number
): IGradientLUTSlot | null => {

    let slots = $slots.get(resolution);
    if (!slots) {
        slots = [];
        $slots.set(resolution, slots);
        $cursors.set(resolution, 0);
    }

    if (slots.length < $GRADIENT_LUT_SLOT_COUNT) {
        const slot: IGradientLUTSlot = {
            "attachment": $createAttachment(resolution, slots.length ? slots[0].attachment : null),
            "hash": 0,
            "interpolation": -1,
            "length": 0,
            "stops": [],
            "pass": 0
        };
        slots.push(slot);
        return slot;
    }

    let cursor = $cursors.get(resolution) as number;
    for (let idx = 0; idx < $GRADIENT_LUT_SLOT_COUNT; ++idx) {

        const slot = slots[cursor];
        cursor = (cursor + 1) % $GRADIENT_LUT_SLOT_COUNT;

        if (slot.pass !== protect_pass) {
            $cursors.set(resolution, cursor);
            return slot;
        }
    }

    return null;
};

/**
 * @description 枠に、これから描く LUT の stops・補間方法を記録
 *              Record in the slot the stops and interpolation of the LUT about to be drawn
 *
 * @param  {IGradientLUTSlot} slot
 * @param  {array} stops
 * @param  {number} interpolation
 * @param  {number} hash
 * @param  {number} pass
 * @return {void}
 * @method
 * @protected
 */
export const $storeGradientLUTSlot = (
    slot: IGradientLUTSlot,
    stops: number[],
    interpolation: number,
    hash: number,
    pass: number
): void => {

    const length = stops.length;
    const values = slot.stops;
    values.length = length;
    for (let idx = 0; idx < length; ++idx) {
        values[idx] = stops[idx];
    }

    slot.hash          = hash;
    slot.interpolation = interpolation;
    slot.length        = length;
    slot.pass          = pass;
};

/**
 * @description すべての枠を破棄 (テスト用)
 *              Discard every slot (for tests)
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearGradientLUTSlots = (): void =>
{
    $slots.clear();
    $cursors.clear();
};
