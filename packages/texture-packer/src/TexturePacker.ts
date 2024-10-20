import { Node } from "./Node";

/**
 * @description テクスチャパッカー
 *              Texture packer
 * 
 * @class
 * @public
 */
export class TexturePacker
{
    /**
     * @description ルートノード
     *              Root node
     * 
     * @type {Node}
     * @private
     */
    private readonly _$root: Node;

    /**
     * @param {number} index
     * @param {number} width
     * @param {number} height 
     * @constructor
     * @public
     */
    constructor (index: number, width: number, height: number)
    {
        this._$root = new Node(index, 0, 0, width, height);
    }

    /**
     * @description テクスチャをパック、挿入したノードを返却します。
     *              Pack the texture and return the inserted node.
     * 
     * @param  {number} width 
     * @param  {number} height 
     * @return {Node | null}
     * @method
     * @public
     */
    insert (width: number, height: number): Node | null 
    {
        return this._$root.insert(width, height);
    }

    /**
     * @description Nodeを破棄します。
     *              Dispose of the Node.
     *
     * @param  {number} x 
     * @param  {number} y 
     * @param  {number} width 
     * @param  {number} height 
     * @return {boolean}
     * @method
     * @public
     */
    dispose (x: number, y: number, width: number, height: number): boolean 
    {
        return this._$root.dispose(x, y, width, height);
    }
}