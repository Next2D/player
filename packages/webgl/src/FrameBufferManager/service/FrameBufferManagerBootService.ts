import {
    $setReadFrameBuffer,
    $setDrawFrameBuffer
} from "../../FrameBufferManager";

/**
 * @description FrameBufferManagerの初期起動
 *              Initial operation of FrameBufferManager
 * 
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const execute = (gl: WebGL2RenderingContext): void =>
{
    $setReadFrameBuffer(gl);
    $setDrawFrameBuffer(gl);
};