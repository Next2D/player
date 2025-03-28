import { Event } from "./Event";

/**
 * @description ビデオを再生または停止すると、VideoEvent オブジェクトを送出します。
 *              When a video is played or stopped, it sends out a VideoEvent object.
 *
 * @class
 * @memberOf next2d.events
 * @extends  Event
 */
export class VideoEvent extends Event
{
    /**
     * @description play イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a play event object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get PLAY (): string
    {
        return "play";
    }

    /**
     * @description playStart イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a playStart event object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get PLAYING (): string
    {
        return "playing";
    }

    /**
     * @description pause イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a pause event object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get PAUSE (): string
    {
        return "pause";
    }

    /**
     * @description seek イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a seek event object.
     *
     * @return {string}
     * @const
     * @static
     */
    static get SEEK (): string
    {
        return "seek";
    }
}