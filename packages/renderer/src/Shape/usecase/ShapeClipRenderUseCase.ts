import { execute as shapeCommandService } from "../service/ShapeCommandService"; 
import { $context } from "../../RendererUtil"; 

/**
 * @description シェイプクリップの描画を実行
 *              Execute drawing of shape clip
 *
 * @param  {Float32Array} render_queue 
 * @param  {number} index 
 * @return {number}
 * @method
 * @protected
 */
export const execute = (render_queue: Float32Array, index: number): number =>
{
    const matrix = render_queue.subarray(index, index + 6);
    index += 6;

    $context.reset();
    $context.setTransform(
        matrix[0], matrix[1], matrix[2],
        matrix[3], matrix[4], matrix[5]
    );

    const hasGrid = Boolean(render_queue[index++]);

    const length = render_queue[index++];
    const commands = render_queue.subarray(index, index + length);
    // shapeCommandService(commands, false, true);

    index += length;
    
    $context.clip(hasGrid);
    
    return index;
};