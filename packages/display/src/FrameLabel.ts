import { EventDispatcher } from "@next2d/events";

/**
 * @description FrameLabel オブジェクトには、フレーム番号および対応するラベル名を指定するプロパティがあります。
 *              MovieClip クラスには、currentLabels プロパティがあります。
 *              これは、現在のシーンの FrameLabel オブジェクトの配列です。
 *              MovieClip インスタンスがシーンを使用していない場合、配列には MovieClip インスタンス全体のすべてのフレームラベルが含まれます。
 *
 *              The FrameLabel object contains properties that specify a frame number and the corresponding label name.
 *              The MovieClip class includes a currentLabels property,
 *              which is an Array of FrameLabel objects for the current scene.
 *              If the MovieClip instance does not use scenes,
 *              the Array includes all frame labels from the entire MovieClip instance.
 *
 * @class
 * @memberOf next2d.display
 * @extends  EventDispatcher
 */
export class FrameLabel extends EventDispatcher
{
    /**
     * @description ラベルの名前。
     *              The name of the label.
     *
     * @type {string}
     * @readonly
     * @public
     */
    public readonly name: string;

    /**
     * @description ラベルを含むフレームの番号。
     *              The frame number containing the label.
     *
     * @type {number}
     * @readonly
     * @public
     */
    public readonly frame: number;

    /**
     * @param {string} name
     * @param {number} frame
     *
     * @constructor
     * @public
     */
    constructor (name: string, frame: number)
    {
        super();

        this.name  = `${name}`;
        this.frame = frame | 0;
    }
}