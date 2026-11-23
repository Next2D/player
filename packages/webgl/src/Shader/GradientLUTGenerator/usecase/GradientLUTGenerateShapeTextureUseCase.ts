import type { ITextureObject } from "../../../interface/ITextureObject";
import type { IGradientLUTSlot } from "../../../interface/IGradientLUTSlot";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { execute as gradientLUTDrawShapeTextureUseCase } from "./GradientLUTDrawShapeTextureUseCase";
import {
    $context,
    $enableScissorTest,
    $disableScissorTest,
    $scissorBox,
    $setScissorBox
} from "../../../WebGLUtil";
import { $getAdaptiveResolution } from "../../GradientLUTGenerator";
import {
    $findGradientLUTSlot,
    $hashGradientStops,
    $storeGradientLUTSlot,
    $takeGradientLUTSlot
} from "../../GradientLUTCache";

/**
 * @description グラデーションのテクスチャを返却します。
 *              同じ stops・補間方法の LUT が枠に残っていれば、描かずにそれを返します。
 *              無ければ、枠の 1 つへ描いてから返します (描画先を切り替えて、元へ戻す)。
 *              Return the texture of the gradient. When a LUT of the same stops and interpolation
 *              is still in a slot it is returned without drawing. Otherwise it is drawn into a slot
 *              first (switching the render target and back).
 *
 * @param  {array} stops
 * @param  {number} interpolation
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (stops: number[], interpolation: number): ITextureObject =>
{
    const resolution = $getAdaptiveResolution(stops.length / 5);
    const hash = $hashGradientStops(stops, interpolation);

    let slot = $findGradientLUTSlot(resolution, stops, interpolation, hash);
    if (slot) {
        return slot.attachment.texture as NonNullable<ITextureObject>;
    }

    // 直後に使うので、どの枠を上書きしてもよい
    slot = $takeGradientLUTSlot(resolution, -1) as IGradientLUTSlot;
    $storeGradientLUTSlot(slot, stops, interpolation, hash, 0);

    const currentAttachment = $context.currentAttachmentObject;

    // JS側で追跡しているscissor矩形を退避（getParameterの同期クエリを回避）
    const scissorX = $scissorBox[0];
    const scissorY = $scissorBox[1];
    const scissorW = $scissorBox[2];
    const scissorH = $scissorBox[3];
    $disableScissorTest();

    blendOneZeroService();
    gradientLUTDrawShapeTextureUseCase(slot.attachment, stops, interpolation);
    blendResetService();

    if (currentAttachment) {
        $context.bind(currentAttachment);
    }

    // bugfix: @see https://github.com/Next2D/player/issues/234
    $enableScissorTest();
    $setScissorBox(scissorX, scissorY, scissorW, scissorH);

    return slot.attachment.texture as NonNullable<ITextureObject>;
};
