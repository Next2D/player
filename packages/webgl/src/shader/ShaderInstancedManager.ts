import { ShaderManager } from "./ShaderManager";

/**
 * @class
 * @extends ShaderManager
 */
export class ShaderInstancedManager extends ShaderManager
{
    /**
     * @description attribute変数の配列
     *              Array of attribute variables
     * 
     * @type {number[]}
     * @public
     */
    public attributes: number[];

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
     * @constructor
     * @public
     */
    constructor (vertex_source: string, fragment_source: string) 
    {
        super(vertex_source, fragment_source);
        this.attributes = [];
        this.count      = 0;
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
        this.count = this.attributes.length = 0;
    }
}