import { $getVertices } from "../../PathCommand";
import { execute as meshStrokeGenerateUseCase } from "./MeshStrokeGenerateUseCase";
import {
    $addFillBuffer,
    $reserveFillBuffer,
    $advanceFillBuffer,
    $getFillBuffer,
    $getFillBufferOffset
} from "../../Mesh";
import {
    $nativeShape,
    $nativeStroke,
    $nativePathActive,
    $setNativePathActive
} from "../../NativeShape";
import {
    $context,
    $viewportWidth,
    $viewportHeight
} from "../../WebGLUtil";

/**
 * @description いまの経路を線のメッシュにして、塗りのバッファへ追加する。
 *              経路を実行環境の側で組み立てていて、線の外周の計算も提供されていれば、
 *              外周の計算もメッシュの生成もそちらで行う。
 *              Turns the current path into a stroke mesh and appends it to the fill buffer.
 *              If the path was built on the runtime side and the runtime also provides the stroke
 *              outline computation, both the outline and the mesh are generated there.
 *
 * @return {number} 追加した頂点数。描く経路が無ければ -1
 * @method
 * @protected
 */
export const execute = (): number =>
{
    if ($nativePathActive && $nativeStroke && $nativeShape && $nativeShape.strokeSize) {

        $setNativePathActive(false);

        // 曲線の分割数を決める拡大率 (MeshGenerateStrokeOutlineUseCase と同じ計算)
        const matrix = $context.$matrix;
        const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const scaleY = Math.sqrt(matrix[3] * matrix[3] + matrix[4] * matrix[4]);

        const size = $nativeShape.strokeSize(
            $context.thickness / 2, $context.joints, $context.caps,
            scaleX > scaleY ? scaleX : scaleY
        );
        if (!size) {
            $nativeShape.reset();
            return -1;
        }

        // MeshFillGenerateUseCase (style = "stroke") と同じ値を渡す
        const colorStyle = $context.$strokeStyle;
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

    const vertices = $getVertices(true);
    if (!vertices.length) {
        return -1;
    }

    const mesh = meshStrokeGenerateUseCase(vertices);
    $addFillBuffer(mesh.buffer);

    return mesh.indexCount;
};
