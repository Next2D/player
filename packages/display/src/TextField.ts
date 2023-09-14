import {
    InteractiveObject,
    Shape
} from "@next2d/display";
import {
    FocusEvent,
    Event as Next2DEvent
} from "@next2d/events";
import {
    Tween,
    Job,
    Easing
} from "@next2d/ui";
import {
    TextData,
    TextFormat,
    parsePlainText,
    parseHtmlText
} from "@next2d/text";
import {
    Rectangle,
    Matrix,
    Point
} from "@next2d/geom";
import type { Player } from "@next2d/core";
import type {
    BoundsImpl,
    TextFieldTypeImpl,
    TextFieldAutoSizeImpl,
    RGBAImpl,
    ParentImpl,
    TextObjectImpl,
    DictionaryTagImpl,
    TextCharacterImpl,
    AttachmentImpl,
    FilterArrayImpl,
    BlendModeImpl,
    PlayerHitObjectImpl,
    PropertyMessageMapImpl,
    PropertyTextMessageImpl,
    Character,
    CachePositionImpl
} from "@next2d/interface";
import type {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    $document,
    $rendererWorker,
    $getEventType,
    $TOUCH_MOVE,
    $MOUSE_MOVE,
    $textArea,
    $currentPlayer
} from "@next2d/util";
import {
    $cacheStore,
    $doUpdated,
    $clamp,
    $getArray,
    $intToRGBA,
    $isNaN,
    $Math,
    $toColorInt,
    $poolFloat32Array6,
    $boundsMatrix,
    $multiplicationMatrix,
    $poolBoundsObject,
    $multiplicationColor,
    $Infinity,
    $Number,
    $poolArray,
    $poolFloat32Array8,
    $generateFontStyle,
    $getBoundsObject,
    $setTimeout,
    $clearTimeout
} from "@next2d/share";

/**
 * TextField クラスは、テキストの表示と入力用の表示オブジェクトを作成するために使用されます。
 * プロパティインスペクターを使用して、テキストフィールドにインスタンス名を付けることができます。
 * また、TextField クラスのメソッドとプロパティを使用して、JavaScript でテキストフィールドを操作できます。
 *
 * The TextField class is used to create display objects for text display and input.
 * You can give a text field an instance name in the Property inspector
 * and use the methods and properties of the TextField class to manipulate it with JavaScript.
 *
 * @class
 * @memberOf next2d.display
 * @extends  InteractiveObject
 */
export class TextField extends InteractiveObject
{
    private readonly _$bounds: BoundsImpl;
    private readonly _$originBounds: BoundsImpl;
    private _$textData: TextData | null;
    private _$background: boolean;
    private _$backgroundColor: number;
    private _$border: boolean;
    private _$borderColor: number;
    private _$htmlText: string;
    private _$multiline: boolean;
    private _$text: string;
    private _$wordWrap: boolean;
    private _$scrollX: number;
    private _$scrollY: number;
    private _$maxChars: number;
    private _$defaultTextFormat: TextFormat;
    private _$rawHtmlText: string;
    private _$textFormats: TextFormat[] | null;
    private _$restrict: string;
    private _$isHTML: boolean;
    private _$autoSize: TextFieldAutoSizeImpl;
    private _$autoFontSize: boolean;
    private _$scrollEnabled: boolean;
    private _$xScrollShape: Shape | null;
    private _$yScrollShape: Shape | null;
    private _$type: TextFieldTypeImpl;
    private _$focus: boolean;
    private _$focusVisible: boolean;
    private _$timerId: number;
    private _$focusIndex: number;
    private _$selectIndex: number;
    private _$thickness: number;
    private _$thicknessColor: number;
    private _$cacheKeys: string[];
    private readonly _$cacheParams: number[];
    private _$stopIndex: number;
    private _$compositionStartIndex: number;
    private _$compositionEndIndex: number;

    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$background = false;

        /**
         * @type {number}
         * @default 0xffffff
         * @private
         */
        this._$backgroundColor = 0xffffff;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$border = false;

        /**
         * @type {number}
         * @default 0x000000
         * @private
         */
        this._$borderColor = 0x000000;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$htmlText = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$multiline = false;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$text = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$wordWrap = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scrollX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scrollY = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxChars = 0;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$stopIndex = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$compositionStartIndex = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$compositionEndIndex = -1;

        // TextFormat
        const textFormat: TextFormat = new TextFormat();
        textFormat._$setDefault();

        /**
         * @type {TextFormat}
         * @private
         */
        this._$defaultTextFormat = textFormat;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$rawHtmlText = "";

        /**
         * @type {object}
         * @private
         */
        this._$bounds = {
            "xMin": 0 ,
            "xMax": 100,
            "yMin": 0 ,
            "yMax": 100
        };

        /**
         * @type {object}
         * @private
         */
        this._$originBounds = {
            "xMin": 0 ,
            "xMax": 100,
            "yMin": 0 ,
            "yMax": 100
        };

        /**
         * @type {string}
         * @default null
         * @private
         */
        this._$restrict = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isHTML = false;

        /**
         * @type {TextData}
         * @private
         */
        this._$textData = null;

        /**
         * @type {string}
         * @default TextFieldAutoSize.NONE
         * @private
         */
        this._$autoSize = "none";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$autoFontSize = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$focusVisible = false;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$focusIndex = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$selectIndex = -1;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$scrollEnabled = true;

        /**
         * @type {Shape}
         * @default null
         * @private
         */
        this._$xScrollShape = null;

        /**
         * @type {Shape}
         * @default null
         * @private
         */
        this._$yScrollShape = null;

        /**
         * @type {string}
         * @default null
         * @private
         */
        this._$type = "static";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$focus = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$thickness = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$thicknessColor = 0;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$textFormats = null;

        /**
         * @type {array}
         * @private
         */
        this._$cacheKeys = $getArray();

        /**
         * @type {array}
         * @private
         */
        this._$cacheParams = $getArray(0, 0, 0);
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class TextField]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class TextField]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.TextField
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.TextField";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object TextField]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object TextField]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.TextField
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.TextField";
    }

    /**
     * @description テキストサイズの自動的な拡大 / 縮小および整列を制御します。
     *              Controls automatic sizing and alignment of text size.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get autoFontSize (): boolean
    {
        return this._$autoFontSize;
    }
    set autoFontSize (auto_font_size: boolean)
    {
        if (auto_font_size !== this._$autoFontSize) {
            this._$autoFontSize = auto_font_size;
            this._$reload();
        }
    }

    /**
     * @description テキストフィールドの自動的な拡大 / 縮小および整列を制御します。
     *              Controls automatic sizing and alignment of text fields.
     *
     * @member {string}
     * @default TextFieldAutoSize.NONE
     * @public
     */
    get autoSize (): TextFieldAutoSizeImpl
    {
        return this._$autoSize;
    }
    set autoSize (auto_size: TextFieldAutoSizeImpl)
    {
        if (auto_size !== this._$autoSize) {
            this._$autoSize = auto_size;
            this._$reload();
        }
    }

    /**
     * @description テキストフィールドに背景の塗りつぶしがあるかどうかを指定します。
     *              Specifies whether the text field has a background fill.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get background (): boolean
    {
        return this._$background;
    }
    set background (background: boolean)
    {
        if (background !== this._$background) {
            this._$background = !!background;
            this._$reset();
        }
    }

    /**
     * @description テキストフィールドの背景の色です。
     *              The color of the text field background.
     *
     * @member {number}
     * @default 0xffffff
     * @public
     */
    get backgroundColor (): number
    {
        return this._$backgroundColor;
    }
    set backgroundColor (background_color: string | number)
    {
        background_color = $clamp(
            $toColorInt(background_color), 0, 0xffffff, 0xffffff
        );

        if (background_color !== this._$backgroundColor) {
            this._$backgroundColor = background_color;
            this._$reset();
        }
    }

    /**
     * @description テキストフィールドに境界線があるかどうかを指定します。
     *              Specifies whether the text field has a border.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get border (): boolean
    {
        return this._$border;
    }
    set border (border: boolean)
    {
        if (border !== this._$border) {
            this._$border = !!border;
            this._$reset();
        }
    }

    /**
     * @description テキストフィールドの境界線の色です。
     *              The color of the text field border.
     *
     * @member {number}
     * @default 0x000000
     * @public
     */
    get borderColor (): number
    {
        return this._$borderColor;
    }
    set borderColor (border_color: string | number)
    {
        border_color = $clamp(
            $toColorInt(border_color), 0, 0xffffff, 0
        );

        if (border_color !== this._$borderColor) {
            this._$borderColor = border_color;
            this._$reset();
        }
    }

    /**
     * @description テキストの任意の表示終了位置の設定
     *              Setting an arbitrary display end position for text.
     *
     * @member {number}
     * @default -1
     * @public
     */
    get stopIndex (): number
    {
        return this._$stopIndex;
    }
    set stopIndex (index: number)
    {
        index |= 0;
        if (this._$stopIndex === index) {
            return ;
        }

        this._$stopIndex = index;

        const textData: TextData = this.getTextData();
        if (!textData.textTable.length) {
            return ;
        }

        let currentTextWidth: number = 2;
        let targetIndex: number = 0;
        for (let idx = 0; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];

            let countUp = false;
            if (textObject.mode === "text") {
                countUp = true;
                currentTextWidth += textObject.w;
            }

            if (targetIndex >= index) {
                targetIndex = idx;
                break;
            }

            if (textObject.mode === "break") {
                countUp = true;
                // reset
                this._$scrollX   = 0;
                currentTextWidth = 2;
            }

            if (countUp) {
                targetIndex++;
            }

        }

        const textObject: TextObjectImpl = textData.textTable[targetIndex];

        const line: number = textObject.line;

        let currentTextHeight: number = 0;
        for (let idx = 0; idx <= line; ++idx) {
            currentTextHeight += textData.heightTable[idx];
        }

        const height: number = this.height;
        let viewTextHeight: number = 0;
        for (let idx = line; idx > -1; --idx) {
            const lineHeight: number = textData.heightTable[idx];
            if (height < viewTextHeight + lineHeight) {
                break;
            }
            viewTextHeight += lineHeight;
        }

        if (currentTextHeight > height) {
            const scaleY: number = (this.textHeight - height) / height;
            this._$scrollY = $Math.min((currentTextHeight - viewTextHeight) / scaleY, height);
        }

        const width: number = this.width;
        let viewTextWidth: number = 0;
        for (let idx = targetIndex; idx > 0; --idx) {
            const textObject: TextObjectImpl = textData.textTable[idx];
            if (textObject.mode !== "text") {
                continue;
            }

            if (width < viewTextWidth + textObject.w) {
                break;
            }
            viewTextWidth += textObject.w;
        }

        if (currentTextWidth > width) {
            const scaleX: number = (this.textWidth - width) / width;
            this._$scrollX = $Math.min((currentTextWidth - viewTextWidth) / scaleX, width + 0.5);
        }
        this._$doChanged();
    }

    /**
     * @description テキストに適用するフォーマットを指定します。
     *              Specifies the formatting to be applied to the text.
     *
     * @member {TextFormat}
     * @public
     */
    get defaultTextFormat (): TextFormat
    {
        return this._$defaultTextFormat._$clone();
    }
    set defaultTextFormat (text_format: TextFormat)
    {
        text_format._$merge(this._$defaultTextFormat);
        this._$defaultTextFormat = text_format;
        this._$reset();
    }

    /**
     * @description このオブジェクトでマウスまたはその他のユーザー入力メッセージを
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get focus (): boolean
    {
        return this._$focus;
    }
    set focus (focus: boolean)
    {
        if (this._$focus === focus) {
            return ;
        }

        if (this._$type !== "input") {
            return ;
        }

        this._$focus = !!focus;

        const name = this._$focus
            ? FocusEvent.FOCUS_IN
            : FocusEvent.FOCUS_OUT;

        if (this.willTrigger(name)) {
            this.dispatchEvent(new FocusEvent(name));
        }

        $textArea.value = "";
        if (this._$focus) {
            $textArea.focus();
        } else {
            this._$focusIndex   = -1;
            this._$selectIndex  = -1;
            this._$focusVisible = false;
            $clearTimeout(this._$timerId);
            $textArea.blur();
        }

        this._$doChanged();
        $doUpdated();
    }

    /**
     * @description テキストフィールドの内容を HTML で表します。
     *              Contains the HTML representation of the text field contents.
     *
     * @member {string}
     * @default ""
     * @public
     */
    get htmlText (): string
    {
        if (this._$htmlText) {
            return this._$htmlText;
        }

        const textData: TextData = this.getTextData();

        let prevTextFormat: TextFormat = textData.textTable[0].textFormat;

        let htmlText = "<span";
        const style: string = prevTextFormat._$toStyleString();
        if (style) {
            htmlText += ` style="${style}"`;
        }
        htmlText += ">";

        for (let idx = 1; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];
            if (textObject.mode === "wrap") {
                continue;
            }

            if (textObject.mode === "break") {
                htmlText += "<br>";
                continue;
            }

            const textFormat: TextFormat = textObject.textFormat;
            if (!prevTextFormat._$isSame(textFormat)) {

                htmlText += "</span><span";

                const style: string = textFormat._$toStyleString();
                if (style) {
                    htmlText += ` style="${style}"`;
                }

                htmlText += ">";

                // change
                prevTextFormat = textFormat;
            }

            if (textObject.mode === "text") {
                htmlText += textObject.text;
            }
        }

        htmlText += "</span>";
        this._$htmlText = htmlText;

        return htmlText;
    }
    set htmlText (html_text: string)
    {
        if (this._$htmlText !== html_text) {
            this._$htmlText    = `${html_text}`;
            this._$rawHtmlText = "";
            this._$text        = "";
            this._$isHTML      = true;
            this._$reload();
        }
    }

    /**
     * @description テキストフィールド内の文字数です。
     *              The int of characters in a text field.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get length (): number
    {
        return this.text.length;
    }

    /**
     * @description ユーザーが入力するときに、テキストフィールドに入力できる最大の文字数です。
     *              The maximum number of characters that the text field can contain,
     *              as entered by a user.
     *
     * @member {number}
     * @default 0
     * @public
     */
    get maxChars (): number
    {
        return this._$maxChars;
    }
    set maxChars (max_chars: number)
    {
        this._$maxChars = max_chars | 0;
    }

    /**
     * @description フィールドが複数行テキストフィールドであるかどうかを示します。
     *              Indicates whether field is a multiline text field.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get multiline (): boolean
    {
        return this._$multiline;
    }
    set multiline (multiline: boolean)
    {
        if (multiline !== this._$multiline) {
            this._$multiline = !!multiline;
            this._$reset();
        }
    }

    /**
     * @description フィールドが複数行テキストフィールドであるかどうかを示します。
     *              Indicates whether field is a multiline text field.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get numLines (): number
    {
        return this.getTextData().lineTable.length;
    }

    /**
     * @description ユーザーがテキストフィールドに入力できる文字のセットを指定します。
     *              Indicates the set of characters that a user can enter into the text field.
     *
     * @member {string}
     * @default null
     * @public
     */
    get restrict (): string
    {
        return this._$restrict;
    }
    set restrict (restrict: string)
    {
        this._$restrict = `${restrict}`;
    }

    /**
     * @description スクロール機能のON/OFFの制御。
     *              Control ON/OFF of the scroll function.
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get scrollEnabled (): boolean
    {
        return this._$scrollEnabled;
    }
    set scrollEnabled (scroll_enabled: boolean)
    {
        this._$scrollEnabled = scroll_enabled;
    }

    /**
     * @description テキストの選択位置を返す
     *              Returns the text selection position
     *
     * @member {number}
     * @readonly
     * @public
     */
    get selectIndex (): number
    {
        return this._$selectIndex;
    }

    /**
     * @description テキストフィールドのスクロール垂直位置です。
     *              The scroll vertical position of the text field.
     *
     * @member {number}
     * @public
     */
    get scrollX (): number
    {
        return this._$scrollX;
    }
    set scrollX (scroll_x: number)
    {
        if (!this._$scrollEnabled
            || this._$autoSize !== "none"
        ) {
            return ;
        }

        // check y animation
        if (this._$yScrollShape
            && this._$yScrollShape.hasLocalVariable("job")
        ) {
            return ;
        }

        scroll_x = $clamp(scroll_x, 0, this.width + 0.5, 0);
        if (this._$scrollX !== scroll_x) {

            const width: number = this.width;
            if (this._$xScrollShape && this.textWidth > width) {

                this._$doChanged();

                this._$scrollX = scroll_x;

                this._$xScrollShape.width = width * width / this.textWidth;
                const parent: ParentImpl<any> = this._$parent;
                if (parent) {

                    // start animation
                    if (this._$xScrollShape.hasLocalVariable("job")) {
                        this._$xScrollShape.getLocalVariable("job").stop();
                    }

                    // view start
                    this._$xScrollShape.alpha = 0.9;

                    // set position
                    this._$xScrollShape.x = this.x + 1
                        + (width - 1 - this._$xScrollShape.width)
                        / (width - 1)
                        * (this._$scrollX - 1);
                    this._$xScrollShape.y = this.y + this.height - this._$xScrollShape.height - 0.5;

                    // added sprite
                    parent.addChildAt(
                        this._$xScrollShape,
                        parent.getChildIndex(this) + 1
                    );

                    const job: Job = Tween.add(this._$xScrollShape,
                        { "alpha" : 0.9 },
                        { "alpha" : 0 },
                        0.5, 0.2, Easing.outQuad
                    );

                    job.addEventListener(Next2DEvent.COMPLETE, (event: Next2DEvent) =>
                    {
                        const shape: Shape = event.target.target;
                        shape.deleteLocalVariable("job");
                        if (shape.parent) {
                            shape.parent.removeChild(shape);
                        }
                    });
                    job.start();

                    this._$xScrollShape.setLocalVariable("job", job);
                }

            }

            if (this.willTrigger(Next2DEvent.SCROLL)) {
                this.dispatchEvent(new Next2DEvent(Next2DEvent.SCROLL, true));
            }
        }
    }
    /**
     * @description テキストフィールドのスクロール垂直位置です。
     *              The scroll vertical position of the text field.
     *
     * @member {number}
     * @public
     */
    get scrollY (): number
    {
        return this._$scrollY;
    }
    set scrollY (scroll_y: number)
    {
        if (!this._$scrollEnabled
            || this._$autoSize !== "none"
            || !this._$multiline && !this._$wordWrap
        ) {
            return ;
        }

        // check x animation
        if (this._$xScrollShape
            && this._$xScrollShape.hasLocalVariable("job")
        ) {
            return ;
        }

        scroll_y = $clamp(scroll_y, 0, this.height, 0);
        if (this._$scrollY !== scroll_y) {

            const height: number = this.height;
            if (this._$yScrollShape && this.textHeight > height) {

                this._$doChanged();

                this._$scrollY = scroll_y;

                this._$yScrollShape.height = height * height / this.textHeight;

                const parent: ParentImpl<any> = this._$parent;
                if (parent) {

                    // start animation
                    if (this._$yScrollShape.hasLocalVariable("job")) {
                        this._$yScrollShape.getLocalVariable("job").stop();
                    }

                    // view start
                    this._$yScrollShape.alpha = 0.9;

                    // set position
                    this._$yScrollShape.x = this.x + this.width - this._$yScrollShape.width - 0.5;
                    this._$yScrollShape.y = this.y + 0.5
                        + (height - 1 - this._$yScrollShape.height)
                        / (height - 1)
                        * (this._$scrollY - 1);

                    // added sprite
                    parent.addChildAt(
                        this._$yScrollShape,
                        parent.getChildIndex(this) + 1
                    );

                    const job: Job = Tween.add(this._$yScrollShape,
                        { "alpha" : 0.9 },
                        { "alpha" : 0 },
                        0.5, 0.2, Easing.outQuad
                    );

                    job.addEventListener(Next2DEvent.COMPLETE, (event: Next2DEvent) =>
                    {
                        const shape: Shape = event.target.target;
                        shape.deleteLocalVariable("job");
                        if (shape.parent) {
                            shape.parent.removeChild(shape);
                        }
                    });
                    job.start();

                    this._$yScrollShape.setLocalVariable("job", job);
                }
            }

            if (this.willTrigger(Next2DEvent.SCROLL)) {
                this.dispatchEvent(new Next2DEvent(Next2DEvent.SCROLL, true));
            }
        }

    }

    /**
     * @description テキストフィールド内の現在のテキストであるストリングです。
     *              A string that is the current text in the text field.
     *
     * @member {string}
     * @default ""
     * @public
     */
    get text (): string
    {
        if (!this._$isHTML) {
            return this._$text;
        }

        if (this._$rawHtmlText) {
            return this._$rawHtmlText;
        }

        let text: string = "";

        const textData: TextData = this.getTextData();
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];
            switch (textObject.mode) {

                case "text":
                    text += textObject.text;
                    break;

                case "break":
                    text += "\r";
                    break;

                default:
                    continue;

            }
        }

        this._$rawHtmlText = text;

        return text;
    }
    set text (text: string | null)
    {
        if (text === null) {
            this._$text        = "";
            this._$htmlText    = "";
            this._$rawHtmlText = "";
            this._$isHTML      = false;
            this._$reload();
            return ;
        }

        text = `${text}`;
        if (text !== this._$text) {
            this._$text        = text;
            this._$htmlText    = "";
            this._$rawHtmlText = "";
            this._$isHTML      = false;
            this._$reload();
        }
    }

    /**
     * @description テキストフィールドのテキストの色です（16 進数形式）。
     *              The color of the text in a text field, in hexadecimal format.
     *
     * @member {number}
     * @public
     */
    get textColor (): number
    {
        return this._$defaultTextFormat.color || 0;
    }
    set textColor (text_color: number)
    {
        this._$defaultTextFormat.color = text_color;
        this._$reload();
    }

    /**
     * @description テキストの高さです（ピクセル単位）。
     *              The height of the text in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get textHeight (): number
    {
        return this.getTextData().textHeight;
    }

    /**
     * @description テキストの幅です（ピクセル単位）。
     *              The width of the text in pixels.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get textWidth ()
    {
        return this.getTextData().textWidth;
    }

    /**
     * @description 輪郭のテキスト幅です。0(デフォルト値)で無効にできます。
     *              The text width of the outline, which can be disabled with 0 (the default value).
     *
     * @member {number}
     * @default 0
     * @public
     */
    get thickness (): number
    {
        return this._$thickness;
    }
    set thickness (thickness: number)
    {
        thickness |= 0;
        if (thickness !== this._$thickness) {
            this._$thickness = thickness;
            this._$reset();
        }
    }

    /**
     * @description 輪郭のテキストの色です（16 進数形式）。
     *              The color of the outline text. (Hexadecimal format)
     *
     * @member {number}
     * @default 0
     * @public
     */
    get thicknessColor (): number
    {
        return this._$thicknessColor;
    }
    set thicknessColor (thickness_color: number)
    {
        thickness_color = $clamp(
            $toColorInt(thickness_color), 0, 0xffffff, 0
        );
        if (thickness_color !== this._$thicknessColor) {
            this._$thicknessColor = thickness_color;
            this._$reset();
        }
    }

    /**
     * @description テキストフィールドのタイプです。
     *              The type of the text field.
     *
     * @member {string}
     * @default TextFieldType.STATIC
     * @public
     */
    get type (): TextFieldTypeImpl
    {
        return this._$type;
    }
    set type (type: TextFieldTypeImpl)
    {
        this._$type = type;
    }

    /**
     * @description テキストフィールドのテキストを折り返すかどうかを示すブール値です。
     *              A Boolean value that indicates whether the text field has word wrap.
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get wordWrap (): boolean
    {
        return this._$wordWrap;
    }
    set wordWrap (word_wrap: boolean)
    {
        if (this._$wordWrap !== word_wrap) {
            this._$wordWrap = !!word_wrap;
            this._$reset();
        }
    }

    /**
     * @description 表示オブジェクトの幅を示します（ピクセル単位）。
     *              Indicates the width of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get width (): number
    {
        return super.width;
    }
    set width (width: number)
    {
        width = +width;
        if (!$isNaN(width) && width > -1) {

            const bounds: BoundsImpl = this._$getBounds(null);

            const xMin: number = $Math.abs(bounds.xMin);
            this._$originBounds.xMax = width + xMin;
            this._$originBounds.xMin = xMin;
            this._$bounds.xMax = this._$originBounds.xMax;
            this._$bounds.xMin = this._$originBounds.xMin;

            super.width = width;

            this._$reload();
        }
    }

    /**
     * @description 表示オブジェクトの高さを示します（ピクセル単位）。
     *              Indicates the height of the display object, in pixels.
     *
     * @member {number}
     * @public
     */
    get height (): number
    {
        return super.height;
    }
    set height (height: number)
    {
        height = +height;
        if (!$isNaN(height) && height > -1) {

            const bounds: BoundsImpl = this._$getBounds(null);

            const yMin: number = $Math.abs(bounds.yMin);
            this._$originBounds.yMax = height + yMin;
            this._$bounds.yMax = this._$originBounds.yMax;
            this._$bounds.yMin = this._$originBounds.yMin;
            super.height = height;

            this._$reload();
        }
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの x 座標を示します。
     *              Indicates the x coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get x (): number
    {
        const matrix: Matrix = this._$transform.matrix;
        const bounds: BoundsImpl = this._$getBounds(null);
        return matrix._$matrix[4] + bounds.xMin;
    }
    set x (x: number)
    {
        const bounds: BoundsImpl = this._$getBounds(null);
        super.x = x - bounds.xMin;
    }

    /**
     * @description 親 DisplayObjectContainer のローカル座標を基準にした
     *              DisplayObject インスタンスの y 座標を示します。
     *              Indicates the y coordinate
     *              of the DisplayObject instance relative to the local coordinates
     *              of the parent DisplayObjectContainer.
     *
     * @member {number}
     * @public
     */
    get y (): number
    {
        const matrix: Matrix = this._$transform.matrix;
        const bounds: BoundsImpl = this._$getBounds(null);
        return matrix._$matrix[5] + bounds.yMin;
    }
    set y (y: number)
    {
        const bounds: BoundsImpl = this._$getBounds(null);
        super.y = y - bounds.yMin;
    }

    /**
     * @description newText パラメーターで指定されたストリングを、
     *              テキストフィールドのテキストの最後に付加します。
     *              Appends the string specified by the newText parameter
     *              to the end of the text of the text field.
     *
     * @param  {string} new_text
     * @return void
     * @method
     * @public
     */
    appendText (new_text: string): void
    {
        const currentText: string = this.text;
        this.text = currentText + `${new_text}`;
    }

    /**
     * @description lineIndex パラメーターで指定された行のテキストを返します。
     *              Returns the text of the line specified by the lineIndex parameter.
     *
     * @param  {number} line_index
     * @return {string}
     * @public
     */
    getLineText (line_index: number): string
    {
        if (!this._$text && !this._$htmlText) {
            return "";
        }

        line_index |= 0;

        let lineText: string = "";
        const textData: TextData = this.getTextData();
        for (let idx: number = 0; idx < textData.textTable.length; idx++) {

            const textObject: TextObjectImpl = textData.textTable[idx];

            if (textObject.line > line_index) {
                break;
            }

            if (textObject.line !== line_index) {
                continue;
            }

            if (textObject.mode !== "text") {
                continue;
            }

            lineText += textObject.text;
        }

        return lineText;
    }

    /**
     * @description beginIndex パラメーターと endIndex パラメーターで指定された文字範囲を、
     *              newText パラメーターの内容に置き換えます。
     *              Replaces the range of characters that the beginIndex
     *              and endIndex parameters specify with the contents of the newText parameter.
     *
     * @param  {number} begin_index
     * @param  {number} end_index
     * @param  {string} new_text
     * @return {void}
     * @method
     * @public
     */
    replaceText (
        begin_index: number,
        end_index: number,
        new_text: string
    ): void {

        begin_index |= 0;
        end_index   |= 0;
        if (begin_index > -1 && end_index > -1 && end_index >= begin_index) {

            const text: string = this.text;

            if (begin_index >= text.length) {

                if (end_index >= text.length && end_index >= begin_index) {
                    this.text = text + `${new_text}`;
                }

            } else {

                this.text = text.slice(0, begin_index)
                    + `${new_text}`
                    + text.slice(end_index, text.length);

            }
        }
    }

    /**
     * @description text、htmlTextに登録したテキスト情報をTextDataクラスで返却
     *              Return text information registered in text and htmlText with TextData class.
     *
     * @param  {number} [sub_font_size = 0]
     * @return {array}
     * @method
     * @public
     */
    getTextData (sub_font_size: number = 0): TextData
    {
        if (this._$textData !== null) {
            return this._$textData;
        }

        if (!this._$isHTML) {

            this._$textData = parsePlainText(
                this._$text,
                this._$defaultTextFormat,
                {
                    "width": this.width,
                    "multiline": this._$multiline,
                    "wordWrap": this._$wordWrap,
                    "subFontSize": sub_font_size,
                    "textFormats": this._$textFormats
                }
            );

        } else {

            this._$textData = parseHtmlText(
                this._$htmlText,
                this._$defaultTextFormat,
                {
                    "width": this.width,
                    "multiline": this._$multiline,
                    "wordWrap": this._$wordWrap,
                    "subFontSize": sub_font_size,
                    "textFormats": this._$textFormats
                }
            );

        }

        return this._$textData;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    selectAll (): void
    {
        const textData: TextData = this.getTextData();
        if (!textData.textTable.length) {
            return ;
        }

        this._$selectIndex = 1;
        this._$focusIndex  = textData.textTable.length;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    arrowUp (): void
    {
        if (this._$focusIndex === -1) {
            return ;
        }

        const textData: TextData = this.getTextData();
        if (!textData.textTable.length) {
            return ;
        }

        const index = textData.textTable.length === this._$focusIndex
            ? this._$focusIndex - 1
            : this._$focusIndex;

        const textObject: TextObjectImpl = textData.textTable[index];
        if (!textObject.line) {
            return ;
        }

        const line: number = textObject.mode === "text"
            ? textObject.line
            : textObject.line - 1;

        let currentWidth: number = 2;
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];
            if (this._$focusIndex === idx) {
                if (textObject.mode === "text") {
                    currentWidth +=  textObject.w / 2;
                }
                break;
            }

            if (textObject.line > line) {
                break;
            }

            if (textObject.line !== line || textObject.mode !== "text") {
                continue;
            }

            currentWidth += textObject.w;
        }

        let textWidth: number = 2;
        const targetLine: number = line - 1;
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];
            if (textObject.line > targetLine) {
                this._$focusIndex  = textObject.mode === "text" ? idx - 1 : idx;
                this._$selectIndex = -1;
                $clearTimeout(this._$timerId);
                this._$blinking();
                return ;
            }

            if (textObject.line !== targetLine || textObject.mode !== "text") {
                continue;
            }

            textWidth += textObject.w;
            if (textWidth > currentWidth) {
                this._$focusIndex  = idx;
                this._$selectIndex = -1;
                $clearTimeout(this._$timerId);
                this._$blinking();
                return ;
            }
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    arrowDown (): void
    {
        if (this._$focusIndex === -1) {
            return ;
        }

        const textData: TextData = this.getTextData();
        if (!textData.textTable.length) {
            return ;
        }

        const textObject: TextObjectImpl = textData.textTable[this._$focusIndex];
        const line: number = textObject.mode === "text"
            ? textObject.line
            : textObject.line - 1;

        if (line === textData.lineTable.length - 1) {
            return ;
        }

        let currentWidth: number = 2;
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];
            if (this._$focusIndex === idx) {
                if (textObject.mode === "text") {
                    currentWidth +=  textObject.w / 2;
                }
                break;
            }

            if (textObject.line > line) {
                break;
            }

            if (textObject.line !== line || textObject.mode !== "text") {
                continue;
            }

            currentWidth += textObject.w;
        }

        let textWidth: number = 2;
        const targetLine: number = line + 1;
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];
            if (textObject.line > targetLine) {
                this._$focusIndex  = textObject.mode === "text" ? idx - 1 : idx;
                this._$selectIndex = -1;
                $clearTimeout(this._$timerId);
                this._$blinking();
                return ;
            }

            if (textObject.line !== targetLine || textObject.mode !== "text") {
                continue;
            }

            textWidth += textObject.w;
            if (textWidth > currentWidth) {
                this._$focusIndex  = idx;
                this._$selectIndex = -1;
                $clearTimeout(this._$timerId);
                this._$blinking();
                return ;
            }
        }

        this._$focusIndex  = textData.textTable.length;
        this._$selectIndex = -1;
        $clearTimeout(this._$timerId);
        this._$blinking();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    arrowLeft (): void
    {
        if (!this._$focusIndex) {
            return ;
        }

        const textData: TextData = this.getTextData();
        if (textData.textTable.length && this._$focusIndex < 2) {
            this._$focusIndex = 1;
            return ;
        }

        this._$focusIndex--;
        this._$selectIndex = -1;
        $clearTimeout(this._$timerId);
        this._$blinking();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    arrowRight (): void
    {
        const textData: TextData = this.getTextData();
        if (textData.textTable.length === this._$focusIndex) {
            return ;
        }

        this._$focusIndex++;
        this._$selectIndex = -1;
        $clearTimeout(this._$timerId);
        this._$blinking();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    deleteText (): void
    {
        if (this._$compositionStartIndex > -1) {
            return ;
        }

        let minIndex: number = 0;
        let maxIndex: number = 0;
        if (this._$selectIndex > -1) {
            minIndex = $Math.min(this._$focusIndex, this._$selectIndex);
            maxIndex = $Math.max(this._$focusIndex, this._$selectIndex) + 1;
            this._$focusIndex = minIndex;
        } else {
            if (2 > this._$focusIndex) {
                return ;
            }

            this._$focusIndex--;
        }

        const textData: TextData = this.getTextData();
        const textObject: TextObjectImpl = textData.textTable[this._$focusIndex];
        if (textObject && textObject.mode === "wrap") {
            this._$focusIndex--;
        }

        const textFormats: TextFormat[] = $getArray();

        let newText: string = "";
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];

            if (this._$focusIndex === idx || minIndex <= idx && maxIndex > idx) {
                continue;
            }

            switch (textObject.mode) {

                case "break":
                    textFormats.push(textObject.textFormat);
                    newText += "\n";
                    break;

                case "text":
                    textFormats.push(textObject.textFormat);
                    newText += textObject.text;
                    break;

                default:
                    continue;

            }
        }

        if (textData.textTable.length === this._$focusIndex) {
            textFormats.pop();
            newText = newText.slice(0, -1);
        }

        this._$selectIndex = -1;
        if (!newText) {
            // reset
            this.text = null;

            this._$scrollX = 0;
            this._$scrollY = 0;

            this._$focusIndex = 0;
        } else {

            const beforeTextWidth: number   = this.textWidth;
            const beforeTextHeight : number = this.textHeight;

            this._$textFormats = textFormats;
            this.text = newText;

            if (this._$scrollX > 0) {
                const textWidth: number = this.textWidth;
                const width: number = this.width;

                switch (true) {

                    case width > textWidth:
                        this._$scrollY = 0;
                        break;

                    case beforeTextWidth !== textWidth:
                        this._$scrollY -= (beforeTextWidth - textWidth)
                            / (textWidth / width);
                        break;

                    default:
                        break;

                }
            }

            if (this._$scrollY > 0) {
                const textHeight: number = this.textHeight;
                const height: number = this.height;

                switch (true) {

                    case height > textHeight:
                        this._$scrollY = 0;
                        break;

                    case beforeTextHeight !== textHeight:
                        this._$scrollY -= (beforeTextHeight - textHeight)
                            / (textHeight / height);
                        break;

                    default:
                        break;

                }
            }

            // reset
            this._$textFormats = null;
            $poolArray(textFormats);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    compositionStart (): void
    {
        this._$compositionStartIndex = this._$focusIndex;
    }

    /**
     * @param  {string} texts
     * @return {void}
     * @method
     * @public
     */
    compositionUpdate (texts: string): void
    {
        if (this._$compositionEndIndex > -1) {
            const cacheIndex: number = this._$compositionStartIndex;
            this._$focusIndex  = this._$compositionStartIndex;
            this._$selectIndex = this._$compositionEndIndex - 1;

            this._$compositionStartIndex = -1;
            this.deleteText();

            // reset
            this._$compositionStartIndex = cacheIndex;
            this._$selectIndex = -1;
        }

        let textData: TextData = this.getTextData();
        const textFormats: TextFormat[] = $getArray();

        const length: number = texts.length;
        let newText: string  = "";
        if (!textData.textTable.length) {
            newText = texts;
            this._$focusIndex = 1;
            this._$compositionStartIndex = 1;
        } else {
            for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

                const textObject: TextObjectImpl = textData.textTable[idx];

                if (this._$compositionStartIndex === idx) {
                    for (let idx: number = 0; idx < length; ++idx) {
                        textFormats.push(textObject.textFormat._$clone());
                        newText += texts[idx];
                    }
                }

                switch (textObject.mode) {

                    case "break":
                        textFormats.push(textObject.textFormat);
                        newText += "\n";
                        break;

                    case "text":
                        textFormats.push(textObject.textFormat);
                        newText += textObject.text;
                        break;

                    default:
                        continue;

                }
            }

            // last text
            if (this._$compositionStartIndex === textData.textTable.length ) {
                const textObject: TextObjectImpl = textData.textTable[this._$compositionStartIndex - 1];
                for (let idx: number = 0; idx < length; ++idx) {
                    textFormats.push(textObject.textFormat._$clone());
                    newText += texts[idx];
                }
            }
        }

        // update
        if (textFormats.length) {
            this._$textFormats = textFormats;
        }
        this.text = newText;

        // reset
        this._$textFormats = null;
        $poolArray(textFormats);

        textData = this.getTextData();
        let index: number = this._$compositionStartIndex + length;
        for (let idx: number = this._$compositionStartIndex; idx < index; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];
            if (!textObject) {
                break;
            }

            textObject.textFormat.underline = true;
            if (textObject.mode === "wrap") {
                if (idx === this._$compositionStartIndex) {
                    let subIndex = 1;
                    for (;;) {
                        const textObject: TextObjectImpl = textData.textTable[idx - subIndex];

                        if (!textObject) {
                            break;
                        }

                        if (textObject.mode === "text") {
                            textObject.textFormat.underline = true;
                            break;
                        }

                        subIndex++;
                    }
                }

                if (idx > this._$compositionStartIndex) {
                    index++;
                }
            }
        }

        this._$compositionEndIndex = this._$focusIndex = index;

        // move textarea element
        const player: Player = $currentPlayer();

        const lastIndex = $Math.min(textData.textTable.length - 1, this._$compositionEndIndex);
        const textObject: TextObjectImpl = textData.textTable[lastIndex];
        if (textObject) {
            const line: number = textObject.line;

            let offsetHeight: number = 0;
            for (let idx = 0; idx < line; ++idx) {
                offsetHeight += textData.heightTable[idx];
            }

            const verticalAlign: number = textData.ascentTable[line];

            let offsetWidth: number = 0;
            let targetIndex: number = this._$compositionEndIndex;
            for (;;) {

                const textObject: TextObjectImpl = textData.textTable[targetIndex--];
                if (!textObject || textObject.line !== line) {
                    break;
                }

                offsetWidth += textObject.w;
            }

            const lineObject: TextObjectImpl = textData.lineTable[line];
            const offsetAlign: number = this._$getAlignOffset(lineObject, this.width);

            const point: Point = this.localToGlobal(new Point(
                offsetWidth + offsetAlign,
                offsetHeight + verticalAlign
            ));

            const div: HTMLElement | null = $document
                .getElementById(player.contentElementId);

            let left: number = point.x * player._$scale;
            let top: number  = point.y * player._$scale;
            if (div) {
                const rect: DOMRect = div.getBoundingClientRect();
                left += rect.left;
                top += rect.top;
            }

            $textArea.style.left = `${left}px`;
            $textArea.style.top  = `${top}px`;
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    compositionEnd (): void
    {
        if (this._$compositionEndIndex > -1) {
            const textData: TextData = this.getTextData();
            for (let idx: number = this._$compositionStartIndex; idx < this._$compositionEndIndex; ++idx) {
                const textObject: TextObjectImpl = textData.textTable[idx];
                textObject.textFormat.underline = false;
            }
            this._$focusIndex = this._$compositionEndIndex;
        }

        $textArea.blur();
        $textArea.value = "";
        if (this._$focus) {
            $textArea.focus();
        }

        this._$selectIndex           = -1;
        this._$compositionStartIndex = -1;
        this._$compositionEndIndex   = -1;
    }

    /**
     * @param  {string} text
     * @return {void}
     * @method
     * @public
     */
    insertText (text: string): void
    {
        if (this._$focusIndex === -1
            || this._$compositionStartIndex > -1
        ) {
            return ;
        }

        if (this._$selectIndex > -1) {
            this.deleteText();
        }

        const textData: TextData = this.getTextData();
        const textFormats: TextFormat[] = $getArray();

        let newText: string = "";
        for (let idx = 1; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];

            if (this._$focusIndex === idx) {
                textFormats.push(textObject.textFormat);
                newText += text;
            }

            switch (textObject.mode) {

                case "break":
                    textFormats.push(textObject.textFormat);
                    newText += "\n";
                    break;

                case "text":
                    textFormats.push(textObject.textFormat);
                    newText += textObject.text;
                    break;

                default:
                    continue;

            }
        }

        if (textData.textTable.length === this._$focusIndex) {
            if (textData.textTable.length) {
                const textObject: TextObjectImpl = textData.textTable[textData.textTable.length - 1];
                textFormats.push(textObject.textFormat);
            } else {
                textFormats.push(this.defaultTextFormat);
                this._$focusIndex++;
            }
            newText += text;
        }

        // update
        this._$textFormats = textFormats;
        this.text = newText;

        // reset
        this._$textFormats = null;
        $poolArray(textFormats);

        this._$focusIndex++;
        this._$selectIndex = -1;

        $textArea.value = "";
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$reset (): void
    {
        this._$textData = null;

        this._$doChanged();
        $doUpdated();

        // cache clear
        $cacheStore.removeCache(this._$instanceId);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$reload (): void
    {
        this._$reset();
        this.getTextData();

        if (this._$autoSize === "none" && this._$autoFontSize) {

            let maxFontSize: number = 0;
            const textData: TextData = this.getTextData();
            for (let idx = 0; idx < textData.textTable.length; ++idx) {
                const textObject: TextObjectImpl = textData.textTable[idx];
                maxFontSize = $Math.max(maxFontSize, textObject.textFormat.size || 0);
            }

            let subSize: number = 1;
            if (this.width && this.textWidth) {

                while (maxFontSize > subSize
                    && this.textWidth + 4 > this.width
                ) {
                    this._$reset();
                    this.getTextData(subSize++);
                }

            }

            if (this.height && this.textHeight) {

                while (maxFontSize > subSize
                    && this.textHeight + 4 > this.height
                ) {
                    this._$reset();
                    this.getTextData(subSize++);
                }

            }
        }

        this._$resize();
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$blinking (): void
    {
        this._$focusVisible = !this._$focusVisible;
        this._$doChanged();
        $doUpdated();

        this._$timerId = +$setTimeout(() =>
        {
            this._$blinking();
        }, 500);

        this._$timerId |= 0;
    }

    /**
     * @param  {number} stage_x
     * @param  {number} stage_y
     * @return {void}
     * @method
     * @private
     */
    _$setIndex (stage_x: number, stage_y: number): void
    {
        if (this._$type !== "input") {
            return ;
        }

        const textData: TextData = this.getTextData();
        if (!textData.textTable.length) {
            this._$focusIndex  = 0;
            this._$selectIndex = -1;
            this.setBlinkingTimer();
            return ;
        }

        const width: number  = this.width;
        const height: number = this.height;

        let tx: number = 0;
        if (this._$scrollX > 0) {
            tx += this._$scrollX * (this.textWidth - width) / width;
        }

        let ty: number = 0;
        if (this._$scrollY) {
            ty += this._$scrollY * (this.textHeight - height) / height;
        }

        const eventType: string  = $getEventType();
        const point: Point = this.globalToLocal(new Point(stage_x, stage_y));
        const x: number = point.x + tx;
        const y: number = point.y + ty;

        let w: number    = 2;
        let yMin: number = 2;
        let yMax: number = yMin + textData.heightTable[0];
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];

            switch (textObject.mode) {

                case "break":
                case "wrap":
                    if (x > w && y > yMin
                        && yMax > y
                        && width > x
                    ) {
                        const index: number = idx;
                        switch (eventType) {

                            case $TOUCH_MOVE:
                            case $MOUSE_MOVE:
                                if (this._$selectIndex !== index && this._$focusIndex === index) {
                                    this._$selectIndex = index;

                                    if (this._$focusIndex !== index) {
                                        this._$focusVisible = false;
                                        $clearTimeout(this._$timerId);

                                        this._$doChanged();
                                        $doUpdated();
                                    }
                                }
                                break;

                            default:
                                if (this._$focusIndex !== index || this._$selectIndex > -1) {
                                    this._$focusIndex  = index;
                                    this._$selectIndex = -1;
                                    this.setBlinkingTimer();
                                }
                                break;
                        }

                        return ;
                    }

                    w = 2;
                    yMin += textData.heightTable[textObject.line - 1];
                    yMax = yMin + textData.heightTable[textObject.line];
                    break;

                case "text":
                    if (idx === textData.textTable.length - 1
                        && x > w && y > yMin && yMax > y
                        && width > x
                    ) {

                        const index: number = textData.textTable.length;
                        switch (eventType) {

                            case $TOUCH_MOVE:
                            case $MOUSE_MOVE:
                                if (this._$selectIndex !== index) {
                                    this._$selectIndex = index;

                                    if (this._$focusIndex !== index) {
                                        this._$focusVisible = false;
                                        $clearTimeout(this._$timerId);

                                        this._$doChanged();
                                        $doUpdated();
                                    }
                                }
                                break;

                            default:
                                if (this._$focusIndex !== index || this._$selectIndex > -1) {
                                    this._$focusIndex  = index;
                                    this._$selectIndex = -1;
                                    this.setBlinkingTimer();
                                }
                                break;

                        }

                        return ;
                    }

                    if (x > w && y > yMin
                        && yMax > y
                        && w + textObject.w > x
                    ) {

                        let index: number = idx;
                        switch (eventType) {
                            case $TOUCH_MOVE:
                            case $MOUSE_MOVE:

                                if (this._$focusIndex > index) { // left
                                    if (this._$focusIndex === index + 1) {
                                        if (w + textObject.w / 2 < x) {
                                            index = -1;
                                        }
                                    } else {
                                        if (w + textObject.w / 2 < x) {
                                            index += 1;
                                        }
                                    }
                                } else { // right
                                    if (this._$focusIndex === index) {
                                        if (w + textObject.w / 2 > x) {
                                            index = -1;
                                        }
                                    } else {
                                        if (w + textObject.w / 2 > x) {
                                            index -= 1;
                                        }
                                    }
                                }

                                if (this._$selectIndex !== index) {
                                    this._$selectIndex = index;

                                    if (this._$selectIndex > -1) {
                                        this._$focusVisible = false;
                                        $clearTimeout(this._$timerId);
                                    }

                                    this._$doChanged();
                                    $doUpdated();
                                }
                                break;

                            default:

                                if (w + textObject.w / 2 < x) {
                                    const textObject: TextObjectImpl = textData.textTable[index + 1];
                                    if (!textObject || textObject.mode === "text") {
                                        index += 1;
                                    }
                                }

                                if (this._$focusIndex !== index || this._$selectIndex > -1) {
                                    this._$focusIndex  = index;
                                    this._$selectIndex = -1;
                                    this.setBlinkingTimer();
                                }
                                break;

                        }
                        return ;
                    }

                    w += textObject.w;
                    break;

                default:
                    break;

            }
        }

        switch (eventType) {

            case $TOUCH_MOVE:
            case $MOUSE_MOVE:
                // reset
                this._$focusIndex  = -1;
                this._$selectIndex = -1;
                break;

            default:
                this._$focusIndex  = textData.textTable.length;
                this._$selectIndex = -1;
                this.setBlinkingTimer();
                break;

        }
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    setBlinkingTimer (): void
    {
        this._$focusVisible = false;

        this._$doChanged();
        $doUpdated();

        $clearTimeout(this._$timerId);
        this._$timerId = +$setTimeout(() =>
        {
            this._$blinking();
        }, 500);
        this._$timerId |= 0;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$resize (): void
    {
        // update bounds
        if (this._$autoSize !== "none") {

            const tf: TextFormat = this._$defaultTextFormat;
            const width: number = this.textWidth + 4 + tf._$widthMargin();

            if (this._$wordWrap) {

                this._$bounds.xMax = this._$originBounds.xMax;
                this._$bounds.xMin = this._$originBounds.xMin;

            } else {

                switch (this._$autoSize) {

                    case "left":
                        this._$bounds.xMax = width + this._$bounds.xMin;
                        break;

                    case "center":
                        this._$bounds.xMax = width + this._$bounds.xMin;
                        break;

                    case "right":
                        this._$bounds.xMax = this._$originBounds.xMax
                            - (this._$originBounds.xMax - this._$originBounds.xMin
                                - (width - this._$originBounds.xMin));
                        break;

                    default:
                        break;

                }

            }

            // set height
            this._$bounds.yMax = this.textHeight + this._$originBounds.yMin;

        } else {
            if (this._$scrollEnabled) {

                if (!this._$xScrollShape) {

                    this._$xScrollShape = new Shape();

                    this
                        ._$xScrollShape
                        .graphics
                        .beginFill("#000", 0.3)
                        .drawRoundRect(0, 0, 3, 3, 3);

                    this
                        ._$xScrollShape
                        .scale9Grid = new Rectangle(1.5, 1.5, 0.1, 0.1);
                }

                if (!this._$yScrollShape) {

                    this._$yScrollShape = new Shape();

                    this
                        ._$yScrollShape
                        .graphics
                        .beginFill("#000", 0.3)
                        .drawRoundRect(0, 0, 3, 3, 3);

                    this
                        ._$yScrollShape
                        .scale9Grid = new Rectangle(1.5, 1.5, 0.1, 0.1);
                }
            }
        }
    }

    /**
     * @param  {object} text_object
     * @param  {number} width
     * @return {number}
     * @method
     * @private
     */
    _$getAlignOffset (text_object: TextObjectImpl, width: number): number
    {
        // default
        const lineWidth: number = this
            .getTextData()
            .getLineWidth(text_object.line);

        const textFormat: TextFormat = text_object.textFormat;

        const leftMargin: number = textFormat.leftMargin || 0;
        if (!this._$wordWrap && lineWidth > width) {
            return $Math.max(0, leftMargin);
        }

        const rightMargin: number = textFormat.rightMargin || 0;
        if (textFormat.align === "center" // format CENTER
            || this._$autoSize === "center" // autoSize CENTER
        ) {
            return $Math.max(0, width / 2 - leftMargin - rightMargin - lineWidth / 2 - 2);
        }

        if (textFormat.align === "right" // format RIGHT
            || this._$autoSize === "right" // autoSize RIGHT
        ) {
            return $Math.max(0, width - leftMargin - lineWidth - rightMargin - 4);
        }

        // autoSize LEFT
        // format LEFT
        return $Math.max(0, leftMargin);
    }

    /**
     * @param   {Float32Array} [matrix=null]
     * @returns {object}
     * @method
     * @private
     */
    _$getBounds (matrix: Float32Array | null = null): BoundsImpl
    {
        if (matrix) {

            let multiMatrix : Float32Array = matrix;

            const rawMatrix: Float32Array = this._$transform._$rawMatrix();
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
            }

            return $boundsMatrix(this._$bounds, multiMatrix);
        }

        return $getBoundsObject(
            this._$bounds.xMin, this._$bounds.xMax,
            this._$bounds.yMin, this._$bounds.yMax
        );
    }

    /**
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$buildCharacter (character: Character<TextCharacterImpl>): void
    {
        const textFormat = this._$defaultTextFormat;

        textFormat.font          = character.font;
        textFormat.size          = character.size | 0;
        textFormat.align         = character.align;
        textFormat.color         = character.color | 0;
        textFormat.leading       = character.leading;
        textFormat.letterSpacing = character.letterSpacing;
        textFormat.leftMargin    = character.leftMargin;
        textFormat.rightMargin   = character.rightMargin;

        switch (character.fontType) {

            case 1:
                textFormat.bold = true;
                break;

            case 2:
                textFormat.italic = true;
                break;

            case 3:
                textFormat.bold   = true;
                textFormat.italic = true;
                break;

        }

        // setup
        this._$type           = character.inputType;
        this._$multiline      = !!character.multiline;
        this._$wordWrap       = !!character.wordWrap;
        this._$border         = !!character.border;
        this._$scrollEnabled  = !!character.scroll;
        this._$thickness      = character.thickness | 0;
        this._$thicknessColor = character.thicknessColor | 0;

        // bounds
        this._$bounds.xMin       = character.originBounds.xMin;
        this._$bounds.xMax       = character.originBounds.xMax;
        this._$bounds.yMin       = character.originBounds.yMin;
        this._$bounds.yMax       = character.originBounds.yMax;
        this._$originBounds.xMin = character.originBounds.xMin;
        this._$originBounds.xMax = character.originBounds.xMax;
        this._$originBounds.yMin = character.originBounds.yMin;
        this._$originBounds.yMax = character.originBounds.yMax;

        switch (character.autoSize) {

            case 1:
                this.autoSize = character.align;
                break;

            case 2:
                this.autoFontSize = true;
                break;

        }

        this.text = character.text;

        if ($rendererWorker && this._$stage) {
            this._$createWorkerInstance();
        }
    }

    /**
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$sync (character: TextCharacterImpl): void
    {
        this._$buildCharacter(character);
    }

    /**
     * @param  {object} tag
     * @param  {DisplayObjectContainer} parent
     * @return {object}
     * @method
     * @private
     */
    _$build (
        tag: DictionaryTagImpl,
        parent: ParentImpl<any>
    ): TextCharacterImpl {

        const character: TextCharacterImpl = this
            ._$baseBuild<TextCharacterImpl>(tag, parent);

        this._$buildCharacter(character);

        return character;
    }

    /**
     * @param   {CanvasToWebGLContext} context
     * @param   {Float32Array} matrix
     * @returns {void}
     * @method
     * @private
     */
    _$clip (
        context: CanvasToWebGLContext,
        matrix: Float32Array
    ): void {

        // size
        const bounds: BoundsImpl = this._$getBounds();
        const xMax = bounds.xMax;
        const xMin = bounds.xMin;
        const yMax = bounds.yMax;
        const yMin = bounds.yMin;
        $poolBoundsObject(bounds);

        const width: number  = $Math.ceil($Math.abs(xMax - xMin));
        const height: number = $Math.ceil($Math.abs(yMax - yMin));
        if (!width || !height) {
            return;
        }

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        context.reset();
        context.setTransform(
            matrix[0], matrix[1], matrix[2],
            matrix[3], matrix[4], matrix[5]
        );
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0, 0);
        context.clip();

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (
        context: CanvasToWebGLContext,
        matrix: Float32Array,
        color_transform: Float32Array
    ): void {

        if (!this._$visible) {
            return ;
        }

        if (this._$focusIndex === -1
            && !this._$background
            && !this._$border
            && !this.text
        ) {
            return;
        }

        let multiColor: Float32Array = color_transform;
        const rawColor: Float32Array = this._$transform._$rawColorTransform();
        if (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = $multiplicationColor(color_transform, rawColor);
        }

        const alpha: number = $clamp(multiColor[3] + multiColor[7] / 255, 0 ,1);
        if (!alpha) {
            return ;
        }

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        const baseBounds: BoundsImpl = this._$getBounds(null);
        baseBounds.xMin -= this._$thickness;
        baseBounds.xMax += this._$thickness;
        baseBounds.yMin -= this._$thickness;
        baseBounds.yMax += this._$thickness;

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        $poolBoundsObject(bounds);

        const width: number  = $Math.ceil($Math.abs(xMax - xMin));
        const height: number = $Math.ceil($Math.abs(yMax - yMin));
        switch (true) {

            case width === 0:
            case height === 0:
            case width === -$Infinity:
            case height === -$Infinity:
            case width === $Infinity:
            case height === $Infinity:
                return;

            default:
                break;

        }

        let xScale: number = +$Math.sqrt(
            multiMatrix[0] * multiMatrix[0]
            + multiMatrix[1] * multiMatrix[1]
        );
        if (!$Number.isInteger(xScale)) {
            const value: string = xScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                xScale = +value.slice(0, index);
            }
            xScale = +xScale.toFixed(4);
        }

        let yScale: number = +$Math.sqrt(
            multiMatrix[2] * multiMatrix[2]
            + multiMatrix[3] * multiMatrix[3]
        );
        if (!$Number.isInteger(yScale)) {
            const value: string = yScale.toString();
            const index: number = value.indexOf("e");
            if (index !== -1) {
                yScale = +value.slice(0, index);
            }
            yScale = +yScale.toFixed(4);
        }

        const filters: FilterArrayImpl = this._$filters || this.filters;
        const canApply: boolean = filters !== null
            && filters.length > 0
            && this._$canApply(filters);

        let filterBounds: BoundsImpl = $getBoundsObject(0, width, 0, height);
        if (canApply && filters) {
            for (let idx: number = 0; idx < filters.length ; ++idx) {
                filterBounds = filters[idx]
                    ._$generateFilterRect(filterBounds, xScale, yScale);
            }
        }

        // cache current buffer
        const manager: FrameBufferManager = context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;
        if (!currentAttachment
            || xMin - filterBounds.xMin > currentAttachment.width
            || yMin - filterBounds.yMin > currentAttachment.height
        ) {
            $poolBoundsObject(filterBounds);
            return;
        }

        if (0 > xMin + filterBounds.xMax || 0 > yMin + filterBounds.yMax) {
            $poolBoundsObject(filterBounds);
            return;
        }

        $poolBoundsObject(filterBounds);

        // texture is small or renew
        if (this._$isUpdated()) {
            $cacheStore.removeCache(this._$instanceId);
            context.cachePosition = null;
            this._$cacheKeys.length = 0;
        }

        if (!this._$cacheKeys.length
            || this._$cacheParams[0] !== xScale
            || this._$cacheParams[1] !== yScale
            || this._$cacheParams[2] !== color_transform[7]
        ) {
            const keys: number[] = $getArray(xScale, yScale);
            this._$cacheKeys = $cacheStore.generateKeys(
                this._$instanceId, keys
            );
            $poolArray(keys);

            this._$cacheParams[0] = xScale;
            this._$cacheParams[1] = yScale;
            this._$cacheParams[2] = color_transform[7];
        }

        const blendMode: BlendModeImpl = this._$blendMode || this.blendMode;
        context.cachePosition = $cacheStore.get(this._$cacheKeys);
        if (!context.cachePosition) {

            // resize
            const lineWidth: number = $Math.min(1, $Math.max(xScale, yScale));
            const width: number  = $Math.ceil($Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            const height: number = $Math.ceil($Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);

            // new canvas
            const canvas: HTMLCanvasElement = $cacheStore.getCanvas();
            canvas.width  = width  + lineWidth * 2;
            canvas.height = height + lineWidth * 2;

            const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
            if (!ctx) {
                throw new Error("the context is null.");
            }

            // border and background
            if (this._$background || this._$border) {

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(width, 0);
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.lineTo(0, 0);

                if (this._$background) {

                    const rgb: RGBAImpl = $intToRGBA(this._$backgroundColor);
                    const alpha: number = $Math.max(0, $Math.min(
                        rgb.A * 255 + multiColor[7], 255)
                    ) / 255;

                    ctx.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                    ctx.fill();
                }

                if (this._$border) {

                    const rgb: RGBAImpl = $intToRGBA(this._$borderColor);
                    const alpha: number = $Math.max(0, $Math.min(
                        rgb.A * 255 + multiColor[7], 255)
                    ) / 255;

                    ctx.lineWidth   = lineWidth;
                    ctx.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                    ctx.stroke();

                }

            }

            // mask start
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(2, 2);
            ctx.lineTo(width - 2, 2);
            ctx.lineTo(width - 2, height - 2);
            ctx.lineTo(2, height - 2);
            ctx.lineTo(2, 2);
            ctx.clip();

            let tx = 2;
            if (this._$scrollX > 0) {
                const scaleX: number = (this.textWidth - this.width) / this.width;
                tx += -this._$scrollX * scaleX;
            }

            let ty = 2;
            if (this._$scrollY > 0) {
                const scaleY: number = (this.textHeight - this.height) / this.height;
                ty += -this._$scrollY * scaleY;
            }

            ctx.setTransform(xScale, 0, 0, yScale, tx * xScale, ty * yScale);

            ctx.beginPath();
            this._$doDraw(ctx, multiColor, width / xScale, lineWidth);
            ctx.restore();

            const position: CachePositionImpl = manager
                .createCachePosition(width, height);

            const texture: WebGLTexture = manager
                .createTextureFromCanvas(ctx.canvas);

            context.drawTextureFromRect(texture, position);

            // set cache
            context.cachePosition = position;
            $cacheStore.set(this._$cacheKeys, position);

            // destroy cache
            $cacheStore.destroy(ctx);
        }

        let drawFilter: boolean = false;
        let offsetX: number = 0;
        let offsetY: number = 0;
        if (filters && filters.length
            && this._$canApply(filters)
        ) {

            drawFilter = true;

            const position: CachePositionImpl = this._$drawFilter(
                context, multiMatrix, filters,
                width, height
            );

            if (position.offsetX) {
                offsetX = position.offsetX;
            }

            if (position.offsetY) {
                offsetY = position.offsetY;
            }

            // update
            context.cachePosition = position;
        }

        const radianX: number = $Math.atan2(multiMatrix[1], multiMatrix[0]);
        const radianY: number = $Math.atan2(-multiMatrix[2], multiMatrix[3]);
        if (!drawFilter && (radianX || radianY)) {

            const tx: number = baseBounds.xMin * xScale;
            const ty: number = baseBounds.yMin * yScale;

            const cosX: number = $Math.cos(radianX);
            const sinX: number = $Math.sin(radianX);
            const cosY: number = $Math.cos(radianY);
            const sinY: number = $Math.sin(radianY);

            context.setTransform(
                cosX, sinX, -sinY, cosY,
                tx * cosX - ty * sinY + multiMatrix[4],
                tx * sinX + ty * cosY + multiMatrix[5]
            );

        } else {

            context.setTransform(1, 0, 0, 1,
                xMin - offsetX, yMin - offsetY
            );

        }

        // draw
        if (context.cachePosition) {

            context.globalAlpha = alpha;
            context.imageSmoothingEnabled = true;
            context.globalCompositeOperation = blendMode;

            context.drawInstance(
                xMin - offsetX, yMin - offsetY, xMax, yMax,
                color_transform
            );

            // cache position clear
            context.cachePosition = null;
        }

        // get cache
        $poolBoundsObject(baseBounds);

        // pool
        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            $poolFloat32Array8(multiColor);
        }
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} color_transform
     * @param  {number} width
     * @param  {number} line_width
     * @return {void}
     * @method
     * @private
     */
    _$doDraw (
        context: CanvasRenderingContext2D,
        color_transform: Float32Array,
        width: number,
        line_width: number
    ): void {

        // init
        const textData: TextData = this.getTextData();
        if (!textData.textTable.length
            && this._$focusIndex > -1
            && this._$focusVisible
        ) {

            const textFormat: TextFormat = this._$defaultTextFormat;

            const rgb: RGBAImpl = $intToRGBA(textFormat.color || 0);
            const alpha: number = $Math.max(0, $Math.min(
                rgb.A * 255 + color_transform[7], 255)
            ) / 255;

            context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, 0 + (textFormat.size || 12));
            context.stroke();

            return ;
        }

        if (this._$selectIndex > -1 && this._$focusIndex > -1) {

            const range: number  = textData.textTable.length - 1;
            let minIndex: number = 0;
            let maxIndex: number = 0;
            if (this._$focusIndex <= this._$selectIndex) {
                minIndex = $Math.min(this._$focusIndex, range);
                maxIndex = $Math.min(this._$selectIndex, range);
            } else {
                minIndex = $Math.min(this._$selectIndex, range);
                maxIndex = $Math.min(this._$focusIndex - 1, range);
            }

            const textObject: TextObjectImpl = textData.textTable[minIndex];
            const lineObject: TextObjectImpl = textData.lineTable[textObject.line];
            const offsetAlign: number = this._$getAlignOffset(lineObject, width);

            let x: number = 0;
            if (minIndex && textObject.mode === "text") {
                let idx: number = minIndex;
                while (idx) {
                    const textObject: TextObjectImpl = textData.textTable[--idx];
                    if (textObject.mode !== "text") {
                        break;
                    }
                    x += textObject.w;
                }
            }

            context.fillStyle = "#b4d7ff";

            let w: number = 0;
            for (let idx: number = minIndex; idx <= maxIndex; ++idx) {

                const textObject: TextObjectImpl = textData.textTable[idx];
                if (textObject.mode === "text") {

                    w += textObject.w;

                    if (idx !== maxIndex) {
                        continue;
                    }
                }

                let y: number = 0;
                const line: number = textObject.mode === "text"
                    ? textObject.line
                    : textObject.line - 1;

                for (let idx: number = 0; idx < line; ++idx) {
                    y += textData.heightTable[idx];
                }

                context.beginPath();
                context.rect(
                    x, y,
                    w + offsetAlign,
                    textData.heightTable[line]
                );
                context.fill();

                x = 0;
                w = 0;
            }
        }

        const tw: number = this.width;
        let scrollX = 0;
        if (this._$scrollX > 0) {
            const scaleX: number = (this.textWidth - tw) / tw;
            scrollX = this._$scrollX * scaleX;
        }
        const limitWidth: number  = tw + scrollX;

        const th: number = this.height;
        let scrollY = 0;
        if (this._$scrollY > 0) {
            const scaleY: number = (this.textHeight - th) / th;
            scrollY = this._$scrollY * scaleY;
        }
        const limitHeight: number = th + scrollY;

        // setup
        let offsetWidth: number   = 0;
        let offsetHeight: number  = 0;
        let offsetAlign: number   = 0;
        let verticalAlign: number = 0;

        let skip = false;
        let currentIndex = -1;
        for (let idx: number = 0; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];
            if (textObject.mode === "text" || textObject.mode === "break") {
                currentIndex++;
                if (this._$stopIndex > -1 && currentIndex > this._$stopIndex) {
                    break;
                }
            }

            if (skip && textObject.mode === "text") {
                continue;
            }

            const textFormat: TextFormat = textObject.textFormat;

            // check
            if (this._$autoSize === "none") {

                if (offsetHeight > limitHeight) {
                    break;
                }

                if (textObject.mode === "text") {
                    if (scrollX > offsetWidth + textObject.w
                        || offsetWidth > limitWidth
                    ) {
                        offsetWidth += textObject.w;
                        continue;
                    }
                }

            }

            // color setting
            const rgb: RGBAImpl = $intToRGBA(textFormat.color || 0);
            const alpha: number = $Math.max(0, $Math.min(
                rgb.A * 255 + color_transform[7], 255)
            ) / 255;

            context.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

            // focus line
            if (this._$focusVisible && this._$focusIndex === idx) {

                const x: number = offsetWidth + offsetAlign + 0.1;
                let line: number = textObject.line;

                let h: number = textObject.y;
                let y: number = textData.ascentTable[line];
                if (textObject.mode !== "text") {
                    h = textObject.mode === "break"
                        ? textObject.h
                        : textData.ascentTable[line - 1];
                    if (line > 0 && !textData.ascentTable[line - 1]) {
                        line = textObject.line;
                        y = textData.ascentTable[line - 1];
                    } else {
                        line = textObject.line - 1;
                        y = textData.ascentTable[line];
                    }
                }

                for (let idx: number = 0; idx < line; ++idx) {
                    y += textData.heightTable[idx];
                }

                context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x, y - h);
                context.stroke();
            }

            if (this._$thickness) {
                const rgb: RGBAImpl = $intToRGBA(this._$thicknessColor);
                const alpha: number = $Math.max(0, $Math.min(
                    rgb.A * 255 + color_transform[7], 255)
                ) / 255;
                context.lineWidth   = this._$thickness;
                context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
            }

            const line: number = textObject.line | 0;
            switch (textObject.mode) {

                case "break":
                case "wrap":

                    // reset width
                    offsetWidth = 0;
                    if (line) {
                        offsetHeight += textData.heightTable[line - 1];
                    }

                    if (scrollY > offsetHeight + textData.heightTable[line]) {
                        skip = true;
                        continue;
                    }

                    verticalAlign = textData.ascentTable[line];
                    offsetAlign   = this._$getAlignOffset(textObject, width);

                    skip = false;

                    break;

                case "text":
                    {
                        context.beginPath();
                        context.font = $generateFontStyle(
                            textFormat.font || "",
                            textFormat.size || 0,
                            !!textFormat.italic,
                            !!textFormat.bold
                        );

                        const x: number = offsetWidth  + offsetAlign;
                        const y: number = offsetHeight + verticalAlign;
                        if (textFormat.underline) {

                            const rgb: RGBAImpl = $intToRGBA(textFormat.color || 0);
                            const alpha: number = $Math.max(0, $Math.min(
                                rgb.A * 255 + color_transform[7], 255)
                            ) / 255;

                            context.lineWidth   = line_width;
                            context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

                            context.beginPath();
                            context.moveTo(x, y + 2);
                            context.lineTo(x + textObject.w, y + 2);
                            context.stroke();

                        }

                        if (this._$thickness) {
                            context.strokeText(textObject.text, x, y);
                        }

                        context.fillText(textObject.text, x, y);

                        offsetWidth += textObject.w;
                    }
                    break;

                // case "image":

                //     if (!obj.loaded) {
                //         continue;
                //     }

                //     context.beginPath();
                //     context.drawImage(obj.image,
                //         obj.hspace, obj.y,
                //         obj.width, obj.height
                //     );

                //     break;

            }
        }

        if (this._$focusVisible && this._$focusIndex >= textData.textTable.length) {
            const textObject: TextObjectImpl = textData.textTable[this._$focusIndex - 1];
            if (textObject) {
                const rgb: RGBAImpl = $intToRGBA(textObject.textFormat.color || 0);
                const alpha: number = $Math.max(0, $Math.min(
                    rgb.A * 255 + color_transform[7], 255)
                ) / 255;

                context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

                const x: number = offsetWidth + offsetAlign + 0.1;
                const y: number = offsetHeight + verticalAlign;

                context.beginPath();
                if (textObject.mode === "text") {
                    context.moveTo(x, y - textObject.y);
                    context.lineTo(x, y);
                } else {
                    context.moveTo(x, y + textObject.h);
                    context.lineTo(x, y);
                }
                context.stroke();
            }
        }
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object}  options
     * @return {boolean}
     * @method
     * @private
     */
    _$mouseHit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: PlayerHitObjectImpl
    ): boolean {

        if (!this._$visible) {
            return false;
        }

        return this._$hit(context, matrix, options);
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object} options
     * @return {boolean}
     * @method
     * @private
     */
    _$hit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: PlayerHitObjectImpl
    ): boolean {

        let multiMatrix: Float32Array = matrix;
        const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        }

        const baseBounds: BoundsImpl = this._$getBounds(null);

        const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
        const xMax = +bounds.xMax;
        const xMin = +bounds.xMin;
        const yMax = +bounds.yMax;
        const yMin = +bounds.yMin;
        $poolBoundsObject(bounds);
        $poolBoundsObject(baseBounds);

        const width: number  = $Math.ceil($Math.abs(xMax - xMin));
        const height: number = $Math.ceil($Math.abs(yMax - yMin));

        context.setTransform(1, 0, 0, 1, xMin, yMin);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(width, 0);
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.lineTo(0, 0);

        if (multiMatrix !== matrix) {
            $poolFloat32Array6(multiMatrix);
        }

        return context.isPointInPath(options.x, options.y);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$createWorkerInstance (): void
    {
        if (this._$created || !$rendererWorker) {
            return ;
        }
        this._$created = true;

        const bounds: BoundsImpl = this._$getBounds();

        const message: PropertyTextMessageImpl = {
            "command": "createTextField",
            "buffer": new Float32Array(),
            "instanceId": this._$instanceId,
            "parentId": this._$parent ? this._$parent._$instanceId : -1,
            "xMin": bounds.xMin,
            "yMin": bounds.yMin,
            "xMax": bounds.xMax,
            "yMax": bounds.yMax,
            "limitWidth": this.width,
            "limitHeight": this.height,
            "textHeight": this.textHeight,
            "autoSize": this._$autoSize,
            "wordWrap": this._$wordWrap,
            "border": this._$border,
            "background": this._$background,
            "thickness": this._$thickness
        };

        if (this._$border) {
            message.borderColor = this._$borderColor;
        }

        if (this._$background) {
            message.backgroundColor = this._$backgroundColor;
        }

        if (this._$thickness) {
            message.thicknessColor = this._$backgroundColor;
        }

        if (this._$characterId > -1) {
            message.characterId = this._$characterId;
        }

        if (this._$loaderInfo) {
            message.loaderInfoId = this._$loaderInfo._$id;
        }

        if (this._$scale9Grid) {
            message.grid = {
                "x": this._$scale9Grid.x,
                "y": this._$scale9Grid.y,
                "w": this._$scale9Grid.width,
                "h": this._$scale9Grid.height
            };
        }

        $rendererWorker.postMessage(message);
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$postProperty (): void
    {
        if (!$rendererWorker) {
            return ;
        }

        const message: PropertyMessageMapImpl<PropertyTextMessageImpl> = this._$createMessage();

        const bounds: BoundsImpl = this._$getBounds(null);
        message.xMin = bounds.xMin;
        message.yMin = bounds.yMin;
        message.xMax = bounds.xMax;
        message.yMax = bounds.yMax;
        $poolBoundsObject(bounds);

        if (this._$isUpdated()) {

            message.limitWidth      = this.width;
            message.limitHeight     = this.height;
            message.textHeight      = this.textHeight;
            message.autoSize        = this._$autoSize;
            message.wordWrap        = this._$wordWrap;

            message.border = this._$border;
            if (this._$border) {
                message.borderColor = this._$borderColor;
            }

            message.background = this._$background;
            if (this._$background) {
                message.backgroundColor = this._$backgroundColor;
            }

            message.thickness = this._$thickness;
            if (this._$thickness) {
                message.thicknessColor = this._$backgroundColor;
            }
        }

        $rendererWorker.postMessage(message);

        this._$posted  = true;
        this._$updated = false;
    }
}
