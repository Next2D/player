import type { IAttachmentObject } from "../../../interface/IAttachmentObject";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { execute as stencilResetService } from "../../../Stencil/service/StencilResetService";
import { execute as gradientLUTDrawShapeTextureUseCase } from "./GradientLUTDrawShapeTextureUseCase";
import { $gradientData } from "../../../Gradient";
import { $fillTypes } from "../../../Mesh";
import {
    $context,
    $enableScissorTest,
    $disableScissorTest,
    $disableStencilTest,
    $scissorBox,
    $setScissorBox
} from "../../../WebGLUtil";
import { $getAdaptiveResolution } from "../../GradientLUTGenerator";
import {
    $findGradientLUTSlot,
    $hashGradientStops,
    $nextGradientLUTPass,
    $storeGradientLUTSlot,
    $takeGradientLUTSlot
} from "../../GradientLUTCache";

/**
 * @description これから塗る図形のグラデーションの LUT を、まとめて先に描きます。
 *              塗りごとに「LUT の描画先へ切り替え → 描く → 元へ戻す」を行うと、元へ戻す切り替えが
 *              塗りの数だけ走る。先にまとめて描けば、元へ戻すのは 1 回で済む。
 *              枠に残っている LUT は描き直さない。枠が足りない分はここでは描かず、塗るときに描く。
 *              Draw the gradient LUTs of the fills about to be painted, all at once. Doing "switch to
 *              the LUT target, draw, switch back" per fill switches back once per fill; drawing them
 *              up front switches back only once. LUTs still held in a slot are not redrawn. Those
 *              that do not fit in the slots are left to be drawn when they are painted.
 *
 * @return {boolean} LUT を描いたら true (ステンシルテストを無効にしている) / true when any LUT was
 *                   drawn (the stencil test has been disabled)
 * @method
 * @protected
 */
export const execute = (): boolean =>
{
    const pass = $nextGradientLUTPass();

    let drawn = false;
    let currentAttachment: IAttachmentObject | null = null;
    let scissorX = 0;
    let scissorY = 0;
    let scissorW = 0;
    let scissorH = 0;

    let position = 0;
    for (let idx = 0; idx < $fillTypes.length; ++idx) {

        // $gradientData の並びは ContextGradientFillUseCase / ContextGradientStrokeUseCase を参照
        const type = $fillTypes[idx];
        let size = 0;
        if (type === "linear") {
            size = 4;
        } else if (type === "radial") {
            size = 5;
        } else {
            continue;
        }

        const stops = $gradientData[position] as number[];
        const interpolation = $gradientData[position + 3] as number;
        position += size;

        const resolution = $getAdaptiveResolution(stops.length / 5);
        const hash = $hashGradientStops(stops, interpolation);

        let slot = $findGradientLUTSlot(resolution, stops, interpolation, hash);
        if (slot) {
            // この回の塗りが使うので、この回のうちは上書きさせない
            slot.pass = pass;
            continue;
        }

        slot = $takeGradientLUTSlot(resolution, pass);
        if (!slot) {
            // 枠が足りない。残りは塗るときに描く
            continue;
        }

        if (!drawn) {
            drawn = true;

            currentAttachment = $context.currentAttachmentObject;

            // JS側で追跡しているscissor矩形を退避（getParameterの同期クエリを回避）
            scissorX = $scissorBox[0];
            scissorY = $scissorBox[1];
            scissorW = $scissorBox[2];
            scissorH = $scissorBox[3];
            $disableScissorTest();

            stencilResetService();
            $disableStencilTest();

            blendOneZeroService();
        }

        $storeGradientLUTSlot(slot, stops, interpolation, hash, pass);
        gradientLUTDrawShapeTextureUseCase(slot.attachment, stops, interpolation);
    }

    if (drawn) {
        blendResetService();

        if (currentAttachment) {
            $context.bind(currentAttachment);
        }

        // bugfix: @see https://github.com/Next2D/player/issues/234
        $enableScissorTest();
        $setScissorBox(scissorX, scissorY, scissorW, scissorH);
    }

    return drawn;
};
