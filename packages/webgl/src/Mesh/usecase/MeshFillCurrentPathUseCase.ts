import { $getVertices } from "../../PathCommand";
import { execute as meshFillGenerateUseCase } from "./MeshFillGenerateUseCase";
import {
    $addFillBuffer,
    $reserveFillBuffer,
    $advanceFillBuffer,
    $getFillBuffer,
    $getFillBufferOffset
} from "../../Mesh";
import {
    $nativeShape,
    $nativePathActive,
    $setNativePathActive
} from "../../NativeShape";
import {
    $context,
    $viewportWidth,
    $viewportHeight
} from "../../WebGLUtil";

/**
 * @description いまの経路を塗りのメッシュにして、塗りのバッファへ追加する。
 *              経路を実行環境の側で組み立てていれば、メッシュもそちらで作る。
 *              Turns the current path into a fill mesh and appends it to the fill buffer.
 *              If the path was built on the runtime side, the mesh is generated there too.
 *
 * @return {number} 追加した頂点数。塗る経路が無ければ -1
 * @method
 * @protected
 */
export const execute = (): number =>
{
    if ($nativePathActive && $nativeShape) {

        $setNativePathActive(false);

        const size = $nativeShape.fillSize();
        if (!size) {
            $nativeShape.reset();
            return -1;
        }

        // MeshFillGenerateUseCase と同じ値を渡す
        const colorStyle = $context.$fillStyle;
        const matrix = $context.$matrix;
        const width  = $viewportWidth;
        const height = $viewportHeight;

        $reserveFillBuffer(size);
        const indexCount = $nativeShape.fill(
            $getFillBuffer(), $getFillBufferOffset(),
            matrix[0] / width, matrix[1] / height,
            matrix[3] / width, matrix[4] / height,
            matrix[6] / width, matrix[7] / height,
            colorStyle[0], colorStyle[1], colorStyle[2], colorStyle[3]
        );
        $advanceFillBuffer(size);

        return indexCount;
    }

    const vertices = $getVertices();
    if (!vertices.length) {
        return -1;
    }

    const mesh = meshFillGenerateUseCase(vertices);
    $addFillBuffer(mesh.buffer);

    return mesh.indexCount;
};
