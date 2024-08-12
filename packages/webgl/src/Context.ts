import {
    $setRenderSize,
    $setWebGL2RenderingContext,
    $changeSamples
} from "./WebGLUtil";

/**
 * @description WebGL版、Next2Dのコンテキスト
 *              WebGL version, Next2D context
 * 
 * @class
 */
export class Context
{
    /**
     * @param {WebGL2RenderingContext} gl
     * @param {number} samples
     * @constructor
     * @public
     */
    constructor (gl: WebGL2RenderingContext, samples: number) 
    {
        $setWebGL2RenderingContext(gl);
        $setRenderSize(gl.getParameter(gl.MAX_TEXTURE_SIZE));
        $changeSamples(samples);

        
    }
}