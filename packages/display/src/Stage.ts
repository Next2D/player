import type { DisplayObject } from "./DisplayObject";
import { DisplayObjectContainer } from "./DisplayObjectContainer";
import {
    $rootMap,
    $stageAssignedMap
} from "./DisplayObjectUtil";

/**
 * @description Stage クラスはメイン描画領域を表します。
 *              The Stage class represents the main drawing area.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
export class Stage extends DisplayObjectContainer
{
    /**
     * @description ステージ幅
     *              Stage width
     * 
     * @type {number}
     * @public
     */
    public stageWidth: number;

    /**
     * @description ステージ高さ
     *              Stage height
     * 
     * @type {number}
     * @public
     */
    public stageHeight: number;

    /**
     * @description フレームレート
     *              Frame rate
     * 
     * @type {number}
     * @public
     */
    public frameRate: number;

    /**
     * @description 背景色
     *              Background color
     * 
     * @type {string}
     * @public
     */
    public backgroundColor: string;

    /**
     * @constructor
     * @public
     */
    constructor () 
    {
        super();

        /**
         * @type {Stage}
         * @public
         */
        this.stageWidth = 0;

        /**
         * @type {Stage}
         * @public
         */
        this.stageHeight = 0;

        /**
         * @type {Stage}
         * @public
         */
        this.frameRate = 1;

        /**
         * @type {Stage}
         * @public
         */
        this.backgroundColor = "transparent";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default "next2d.display.Stage"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.Stage";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default "next2d.display.Stage"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.Stage";
    }

    /**
     * @description Stage に追加した DisplayObject は rootとして rootMap に追加
     *              DisplayObject added to Stage is added to rootMap as root
     * 
     * @param  {DisplayObject} display_object 
     * @return {DisplayObject}
     * @method
     * @public
     */
    addChild<T extends DisplayObject>(display_object: T): T
    {
        $rootMap.set(display_object, display_object);
        $stageAssignedMap.add(display_object);

        return super.addChild(display_object);
    }
}

export const $stage: Stage = new Stage();
$stageAssignedMap.add($stage);