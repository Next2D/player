import type { IPath } from "../../interface/IPath";
import { execute as meshAddQuadSegmentUseCase } from "./MeshAddQuadSegmentUseCase";
import { execute as meshAddLineSegmentUseCase } from "./MeshAddLineSegmentUseCase";

/**
 * @description ラインセグメントを生成
 *              Generate a line segment
 * 
 * @param  {IPath} vertex
 * @return {void}
 * @method
 * @protected
 */
export const execute = (vertex: IPath): void =>
{
    const length = vertex.length - 5;
    for (let idx = 0; idx < length; idx += 3) {

        if (vertex[idx + 2]) {
            continue;
        }

        if (vertex[idx + 5]) {
            meshAddQuadSegmentUseCase(
                vertex[idx    ] as number,
                vertex[idx + 1] as number,
                vertex[idx + 3] as number,
                vertex[idx + 4] as number,
                vertex[idx + 6] as number,
                vertex[idx + 7] as number
            );
        } else {
            meshAddLineSegmentUseCase(
                vertex[idx    ] as number,
                vertex[idx + 1] as number,
                vertex[idx + 3] as number,
                vertex[idx + 4] as number
            );
        }
    }
};