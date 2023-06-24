import { DisplayObjectContainer } from "./DisplayObjectContainer";
import type { Player } from "../../player/Player";
import type { DisplayObjectImpl } from "../../interface/DisplayObjectImpl";
import { $devicePixelRatio } from "../../util/Shortcut";
import {
    $clamp,
    $toColorInt,
    $uintToRGBA
} from "../../util/RenderUtil";

/**
 * Stage クラスはメイン描画領域を表します。
 * The Stage class represents the main drawing area.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObjectContainer
 */
export class Stage extends DisplayObjectContainer
{
    public _$player: Player | null;
    public _$invalidate: boolean;
    private _$color: number;
    public _$frameRate: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Player}
         * @default null
         * @private
         */
        this._$player = null;

        /**
         * @type {Stage}
         * @private
         */
        this._$root = this;

        /**
         * @type {Stage}
         * @private
         */
        this._$stage = this;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$invalidate = true;

        /**
         * @type {number}
         * @default 0xffffffff
         * @private
         */
        this._$color = 0xffffffff;

        /**
         * @type {number}
         * @default 60
         * @private
         */
        this._$frameRate = 60;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Stage]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Stage]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.Stage
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.Stage";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Stage]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object Stage]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.Stage
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.Stage";
    }

    /**
     * @description 背景色です。
     *              background color.
     *
     * @member {number}
     * @public
     */
    get color (): number
    {
        return this._$color;
    }
    set color (color: number)
    {
        this._$color = $clamp($toColorInt(color), 0, 0xffffff, 0xffffff);
        const player: Player | null = this._$player;
        if (player && player.context) {
            const rgba = $uintToRGBA(this._$color);
            player
                .context
                ._$setColor(
                    rgba.R / 255,
                    rgba.G / 255,
                    rgba.B / 255,
                    rgba.A / 255
                );
        }
    }

    /**
     * @description ステージのフレームレートを取得または設定します。
     *              Gets and sets the frame rate of the stage.
     *
     * @member {number}
     * @public
     */
    get frameRate ()
    {
        return this._$frameRate;
    }
    set frameRate (frame_rate)
    {
        this._$frameRate = $clamp(+frame_rate, 1, 60, 60);
        if (this._$player && !this._$player._$stopFlag) {
            this._$player.stop();
            this._$player.play();
        }
    }

    /**
     * @description Player オブジェクトを返します。
     *              Returns a Player object.
     *
     * @member {Player}
     * @readonly
     * @public
     */
    get player (): Player | null
    {
        return this._$player;
    }

    /**
     * @description 現在のCanvasの高さをピクセル単位で指定します。
     *              Specifies the height of the current Canvas in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get canvasHeight (): number
    {
        return this._$player
            ? this._$player._$height / $devicePixelRatio
            : 0;
    }

    /**
     * @description 現在のCanvasの幅をピクセル単位で指定します。
     *              Specifies the width of the current Canvas in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get canvasWidth (): number
    {
        return this._$player
            ? this._$player._$width / $devicePixelRatio
            : 0;
    }

    /**
     * @description 現在のStageの高さをピクセル単位で指定します。
     *              Specifies the height of the current Stage in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get currentStageHeight (): number
    {
        return this._$player
            ? this._$player.height * this._$player._$scale
            : 0;
    }

    /**
     * @description 現在のStageの幅をピクセル単位で指定します。
     *              Specifies the width of the current Stage in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get currentStageWidth (): number
    {
        return this._$player
            ? this._$player.width * this._$player._$scale
            : 0;
    }

    /**
     * @description 初期設定したステージの高さをピクセル単位で指定します。
     *              Specifies the height of the initially set stage in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get stageHeight (): number
    {
        return this._$player ? this._$player.height : 0;
    }

    /**
     * @description 初期設定したステージの幅をピクセル単位で指定します。
     *              Specifies the width of the initially set stage in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get stageWidth (): number
    {
        return this._$player ? this._$player.width : 0;
    }

    /**
     * @description 表示リストをレンダリングする必要のある次の機会に、
     *              表示オブジェクトに警告するようランタイムに通知します。
     *              (例えば、再生ヘッドを新しいフレームに進める場合などです。)
     *              Calling the invalidate() method signals runtimes
     *              to alert display objects on the next opportunity
     *              it has to render the display list.
     *              (for example, when the playhead advances to a new frame)
     *
     * @return {void}
     * @method
     * @public
     */
    invalidate (): void
    {
        this._$invalidate = true;
    }

    /**
     * @param  {DisplayObject} child
     * @return {DisplayObject}
     * @method
     * @private
     */
    _$addChild (child: DisplayObjectImpl<any>): DisplayObjectImpl<any>
    {
        child._$stage = this;
        child._$root  = child;
        return super._$addChild(child);
    }
}
