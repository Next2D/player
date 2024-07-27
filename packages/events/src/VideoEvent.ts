import { Event } from "./Event";
import { execute as eventFormatToStringService } from "./Event/EventFormatToStringService";

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
     * 指定されたクラスのストリングを返します。
     * Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default "[class VideoEvent]"
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class VideoEvent]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @member  {string}
     * @default "next2d.events.VideoEvent"
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.events.VideoEvent";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return {string}
     * @method
     * @public
     */
    toString (): string
    {
        return eventFormatToStringService(this,
            "VideoEvent",
            "type", "bubbles", "cancelable", "eventPhase"
        );
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @member  {string}
     * @default "next2d.events.VideoEvent"
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.events.VideoEvent";
    }

    /**
     * @description play イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a play event object.
     *
     * @return {string}
     * @default play
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
     * @default "playStart"
     * @const
     * @static
     */
    static get PLAY_START (): string
    {
        return "playStart";
    }

    /**
     * @description playEnd イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a playEnd event object.
     *
     * @return {string}
     * @default "playEnd"
     * @const
     * @static
     */
    static get PLAY_END (): string
    {
        return "playEnd";
    }

    /**
     * @description pause イベントオブジェクトの type プロパティ値を定義します。
     *              Defines the value of the type property of a pause event object.
     *
     * @return {string}
     * @default "pause"
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
     * @default "seek"
     * @const
     * @static
     */
    static get SEEK (): string
    {
        return "seek";
    }
}