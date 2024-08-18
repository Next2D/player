
import type { Node } from "../../AtlasManager/domain/Node";
import { $gl } from "../../WebGLUtil";

/**
 * @description アトラスへの描画範囲を設定
 *              Set the drawing range for the atlas
 * 
 * @param  {Node} node
 * @return {void}
 * @method
 * @protected
 */
export const execute = (node: Node): void =>
{
    // 描画領域をあらためて設定
    $gl.viewport(node.x, node.y, node.w, node.h);

    // 初期化範囲を設定
    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(0, 0, node.w, node.h);

    // 初期化
    $gl.clearColor(0, 0, 0, 0);
    $gl.clear($gl.COLOR_BUFFER_BIT | $gl.STENCIL_BUFFER_BIT);

    // 解除
    $gl.disable($gl.SCISSOR_TEST);
};
