import { execute as vertexArrayObjectBindService } from "../service/VertexArrayObjectBindService";
import { $gl } from "../../WebGLUtil";
import {
    $instancedVertexArrayObject,
    $attributeWebGLBuffer
} from "../../VertexArrayObject";
import { renderQueue } from "@next2d/render-queue";

/**
 * @type {number}
 * @private
 */
let $attributeBufferLength: number = 0;

/**
 * @description インスタンス用のデータをバインドします。
 *              Binds data for instances.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    vertexArrayObjectBindService($instancedVertexArrayObject);

    $gl.bindBuffer($gl.ARRAY_BUFFER, $attributeWebGLBuffer);

    if (renderQueue.buffer.length > $attributeBufferLength) {
        $attributeBufferLength = renderQueue.buffer.length;
    }

    // バッファオーファニング: 直前のdrawArraysInstancedが参照中の可能性がある領域を
    // 上書きするとドライバが暗黙の同期(ストール)を挿入するため、毎回新しいストレージを
    // 確保してから書き込む。STREAM_DRAW: 毎フレーム更新されるデータに最適。
    // Buffer orphaning: overwriting a region that the previous drawArraysInstanced
    // may still be reading can cause an implicit driver sync (stall), so allocate
    // fresh storage before each upload. STREAM_DRAW: optimal for per-frame data.
    $gl.bufferData(
        $gl.ARRAY_BUFFER,
        $attributeBufferLength * 4, // renderQueue.buffer.byteLength
        $gl.STREAM_DRAW
    );

    $gl.bufferSubData(
        $gl.ARRAY_BUFFER, 0,
        renderQueue.buffer, 0, renderQueue.offset
    );
};