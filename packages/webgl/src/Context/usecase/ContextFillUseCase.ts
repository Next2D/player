import type { IFillTyle } from "../../interface/IFillTyle";
import { $getVertices } from "../../PathCommand";
import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";

/**
 * @description Contextのパスコマンドの塗り実行します。
 *              Execute Context path command painting.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (fill_type: IFillTyle): void =>
{
    const vertices = $getVertices();
    if (!vertices.length) {
        return ;
    }

    const vertexArrayObject = vertexArrayObjectCreateFillObjectUseCase(vertices);
    switch (fill_type) {

        case 0: // normal fill

            break;

        case 1: // gradient fill
            // todo
            break;

        case 2: // pattern fill
            // todo
            break;

        default:
            break;

    }
};