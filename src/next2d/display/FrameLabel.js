/**
 * @class
 * @memberOf next2d.display
 * @extends  EventDispatcher
 */
class FrameLabel extends EventDispatcher
{
    /**
     * FrameLabel オブジェクトには、フレーム番号および対応するラベル名を指定するプロパティがあります。
     * MovieClip クラスには、currentLabels プロパティがあります。
     * これは、現在のシーンの FrameLabel オブジェクトの配列です。
     * MovieClip インスタンスがシーンを使用していない場合、配列には MovieClip インスタンス全体のすべてのフレームラベルが含まれます。
     *
     * The FrameLabel object contains properties that specify a frame number and the corresponding label name.
     * The MovieClip class includes a currentLabels property,
     * which is an Array of FrameLabel objects for the current scene.
     * If the MovieClip instance does not use scenes,
     * the Array includes all frame labels from the entire MovieClip instance.
     *
     * @example <caption>Example usage of FrameLabel.</caption>
     * // static BlendMode
     * const {FrameLabel} = next2d.display;
     * const frameLabel = new FrameLabel();
     * frameLabel.addEventListener(Event.FRAME_LABEL, function (event)
     * {
     *     // more...
     * }
     *
     * @param {string} name
     * @param {number} frame
     *
     * @constructor
     * @public
     */
    constructor (name, frame)
    {
        super();

        this._$name  = `${name}`;
        this._$frame = frame|0;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class FrameLabel]
     * @method
     * @static
     */
    static toString()
    {
        return "[class FrameLabel]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:FrameLabel
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:FrameLabel";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object FrameLabel]
     * @method
     * @public
     */
    toString ()
    {
        return "[object FrameLabel]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display:FrameLabel
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:FrameLabel";
    }

    /**
     * @description ラベルを含むフレームの番号。
     *              The frame number containing the label.
     *
     * @return  {number}
     * @method
     * @readonly
     * @public
     */
    get frame ()
    {
        return this._$frame;
    }

    /**
     * @description ラベルの名前。
     *              The name of the label.
     *
     * @return  {string}
     * @method
     * @readonly
     * @public
     */
    get name ()
    {
        return this._$name;
    }
}