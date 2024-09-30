import { $getVertexBufferData } from "../../Mesh";
import { execute as meshAddLineJoinUseCase } from "./MeshAddLineJoinUseCase";

/**
 * @description ラインジョインを生成
 *              Generate a line join
 *
 * @param  {number} vertex_begin_offset
 * @param  {number} vertex_end_offset
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    vertex_begin_offset: number,
    vertex_end_offset: number
): void => {
    const vbd = $getVertexBufferData();
    const length = vertex_end_offset - 55;
    for (let idx = vertex_begin_offset; idx < length; idx += 28) {
        const indexOffset = idx / 7;
        meshAddLineJoinUseCase(
            vbd[idx],      vbd[idx + 1],
            vbd[idx + 21], vbd[idx + 22], vbd[idx + 27],
            vbd[idx + 49], vbd[idx + 50],
            indexOffset + 2, indexOffset + 3,
            indexOffset + 4, indexOffset + 5
        );
    }
};