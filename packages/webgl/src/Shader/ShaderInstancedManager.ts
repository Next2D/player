import { ShaderManager } from "./ShaderManager";
import { renderQueue } from "@next2d/render-queue";

/**
 * @class
 * @extends ShaderManager
 */
export class ShaderInstancedManager extends ShaderManager
{
    /**
     * @description attribute変数の数
     *              Number of attribute variables
     *
     * @type {number}
     * @public
     */
    public count: number;

    /**
     * @param {string} vertex_source
     * @param {string} fragment_source
     * @param {boolean} [atlas=true]
     * @constructor
     * @public
     */
    constructor (vertex_source: string, fragment_source: string, atlas: boolean = true)
    {
        super(vertex_source, fragment_source, atlas);
        this.count = 0;
    }

    /**
     * @description attributeの配列を初期化します。
     *              Initialize the array of attributes.
     *
     * @return {void}
     * @method
     * @public
     */
    clear (): void
    {
        this.count = renderQueue.offset = 0;
    }
}