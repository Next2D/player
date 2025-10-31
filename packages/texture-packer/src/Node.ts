import { execute as nodeInsertService } from "./Node/service/NodeInsertService";
import { execute as nodeDisposeService } from "./Node/service/NodeDisposeService";

/**
 * @description テクスチャパッキングのノードクラス
 *              Node class for texture
 *
 * @class
 * @public
 */
export class Node
{
    /**
     * @description パッキングされたテクスチャの識別番号
     *              Identification number of packed texture
     *
     * @type {number}
     * @public
     */
    public index: number;

    /**
     * @description パッキングされたテクスチャのx座標
     *              x coordinate of packed texture
     *
     * @type {number}
     * @public
     */
    public x: number;

    /**
     * @description パッキングされたテクスチャのy座標
     *              y coordinate of packed texture
     *
     * @type {number}
     * @public
     */
    public y: number;

    /**
     * @description パッキングされたテクスチャの幅
     *              Width of packed texture
     *
     * @type {number}
     * @public
     */
    public w: number;

    /**
     * @description パッキングされたテクスチャの高さ
     *              Height of packed texture
     *
     * @type {number}
     * @public
     */
    public h: number;

    /**
     * @description 左のノード
     *              Left node
     *
     * @type {Node}
     * @public
     */
    public left: Node | null;

    /**
     * @description 右のノード
     *              Right node
     *
     * @type {Node}
     * @public
     */
    public right: Node | null;

    /**
     * @description 使用済みフラグ
     *              Used flag
     *
     * @type {boolean}
     * @public
     */
    public used: boolean;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @constructor
     * @public
     */
    constructor (index:number, x: number, y: number, w: number, h: number)
    {
        this.index = index;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.left  = null;
        this.right = null;
        this.used  = false;
    }

    /**
     * @description ノードにテクスチャを挿入、挿入したノードを返却します。
     *              Insert a texture into the node and return the inserted node.
     *
     * @param  {number} width
     * @param  {number} height
     * @return {Node | null}
     * @method
     * @public
     */
    insert (width: number, height: number): Node | null
    {
        return nodeInsertService(this, width, height);
    }

    /**
     * @description ノードを削除します。
     *              Remove the node.
     *
     * @return {boolean}
     * @method
     * @public
     */
    dispose (x: number, y: number, width: number, height: number): boolean
    {
        return nodeDisposeService(this, x, y, width, height);
    }

    /**
     * @description 新規ノードを生成
     *              Create a new node
     *
     * @param  {number} index
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @return {Node}
     * @method
     * @public
     */
    create (index: number, x: number, y: number, w: number, h: number): Node
    {
        return new Node(index, x, y, w, h);
    }
}