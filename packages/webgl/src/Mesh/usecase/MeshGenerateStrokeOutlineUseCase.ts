import type { IPath } from "../../interface/IPath";
import type { IPoint } from "../../interface/IPoint";
import { execute as meshCalculateLineRectangleUseCase } from "./MeshCalculateLineRectangleUseCase";
import { execute as meshCalculateCurveRectangleUseCase } from "./MeshCalculateCurveRectangleUseCase";
import { execute as meshGenerateCalculateRoundJoinUseCase } from "./MeshGenerateCalculateRoundJoinUseCase";
import { execute as meshGenerateCalculateBevelJoinUseCase } from "./MeshGenerateCalculateBevelJoinUseCase";
import { execute as meshGenerateCalculateRoundCapService } from "../service/MeshGenerateCalculateRoundCapService";
import { execute as meshGenerateCalculateSquareCapService } from "../service/MeshGenerateCalculateSquareCapService";
import { $context } from "../../WebGLUtil";

/**
 * @description 線の外周を算出して塗りのフォーマットで返却
 *              Calculate the outer circumference of the line and return it in the format of the fill
 *
 * @param  {IPath} vertices
 * @param  {number} thickness
 * @return {IPath[]}
 * @method
 * @protected
 */
export const execute = (vertices: IPath, thickness: number): IPath[] =>
{
    const startPoint: IPoint = {
        "x": vertices[0] as number,
        "y": vertices[1] as number
    };

    const controlPoint: IPoint = {
        "x": 0,
        "y": 0
    };

    const endPoint: IPoint = {
        "x": 0,
        "y": 0
    };

    const rectangles: IPath[] = [];
    for (let idx = 3; idx < vertices.length; idx += 3) {

        const x = vertices[idx    ] as number;
        const y = vertices[idx + 1] as number;

        if (vertices[idx + 2] as boolean) {
            controlPoint.x = x;
            controlPoint.y = y;
            continue;
        }

        endPoint.x = x;
        endPoint.y = y;
        if (vertices[idx - 1] as boolean) {
            rectangles.push(
                meshCalculateCurveRectangleUseCase(startPoint, controlPoint, endPoint, thickness)
            );
        } else {
            rectangles.push(
                meshCalculateLineRectangleUseCase(startPoint, endPoint, thickness)
            );
        }

        if (rectangles.length > 1) {
            switch ($context.joints) {

                case 0: // bevel
                    meshGenerateCalculateBevelJoinUseCase(
                        startPoint.x, startPoint.y, thickness, rectangles
                    );
                    break;

                case 1: // miter
                    meshGenerateCalculateBevelJoinUseCase(
                        startPoint.x, startPoint.y, thickness, rectangles
                    );
                    break;

                case 2: // round
                    meshGenerateCalculateRoundJoinUseCase(
                        startPoint.x, startPoint.y, thickness, rectangles
                    );
                    break;

            }
        }

        startPoint.x = endPoint.x;
        startPoint.y = endPoint.y;
    }

    // 始点と終点が繋がってない時はcapsの設定を適用
    if ($context.caps
        && vertices[0] !== vertices[vertices.length - 3]
        || vertices[1] !== vertices[vertices.length - 2]
    ) {
        switch ($context.caps) {

            case 1: // round
                meshGenerateCalculateRoundCapService(
                    vertices, thickness, rectangles
                );
                break;

            case 2: // square:
                meshGenerateCalculateSquareCapService(
                    vertices, thickness, rectangles
                );
                break;

        }
    }

    return rectangles;
};