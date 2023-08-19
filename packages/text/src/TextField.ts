import { TextFormat } from "./TextFormat";
import { Player } from "@next2d/core";
import {
    InteractiveObject,
    Shape,
    Sprite
} from "@next2d/display";
import {
    FocusEvent,
    Event as Next2DEvent,
    MouseEvent as Next2DMouseEvent
} from "@next2d/events";
import {
    Tween,
    Job
} from "@next2d/ui";
import {
    Rectangle,
    Matrix
} from "@next2d/geom";
import {
    BoundsImpl,
    TextFieldTypeImpl,
    TextFormatVerticalAlignImpl,
    TextFieldAutoSizeImpl,
    RGBAImpl,
    TextObjectImpl,
    ParentImpl,
    TextObjectModeImpl,
    TextDataImpl,
    TextImageObjectImpl,
    TextStringObjectImpl,
    TextBreakObjectImpl,
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
import {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    $currentPlayer,
    $DIV,
    $isSafari,
    $MOUSE_DOWN,
    $MOUSE_UP,
    $MOUSE_WHEEL,
    $P_TAG,
    $PREFIX,
    $rendererWorker,
    $SCROLL,
    $textContext,
    $TOUCH_END,
    $TOUCH_START,
    $document,
    $RegExp
} from "@next2d/util";
import {
    $cacheStore,
    $doUpdated,
    $clamp,
    $getArray,
    $intToRGBA,
    $isNaN,
    $Math,
    $requestAnimationFrame,
    $toColorInt,
    $getMap,
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
    $devicePixelRatio,
    $getBoundsObject
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
 * @memberOf next2d.text
 * @extends  InteractiveObject
 */
export class TextField extends InteractiveObject
{
    private readonly _$bounds: BoundsImpl;
    private readonly _$originBounds: BoundsImpl;
    private readonly _$textData: TextDataImpl<any>[];
    private readonly _$widthTable: number[];
    private readonly _$heightTable: number[];
    private readonly _$textFormatTable: TextFormat[];
    private readonly _$objectTable: TextDataImpl<any>[];
    private readonly _$imageData: TextDataImpl<any>[];
    private readonly _$textHeightTable: number[];
    private readonly _$heightCache: Map<string, number>;
    private _$background: boolean;
    private _$backgroundColor: number;
    private _$border: boolean;
    private _$borderColor: number;
    private _$htmlText: string;
    private _$multiline: boolean;
    private _$text: string;
    private _$wordWrap: boolean;
    private _$scrollH: number;
    private _$scrollV: number;
    private _$maxScrollV: number | null;
    private _$maxScrollH: number | null;
    private _$maxChars: number;
    private _$defaultTextFormat: TextFormat;
    private _$rawHtmlText: string;
    private _$restrict: string;
    private _$isHTML: boolean;
    private _$textHeight: number | null;
    private _$textWidth: number | null;
    private _$textarea: HTMLTextAreaElement | null;
    private _$autoSize: TextFieldAutoSizeImpl;
    private _$autoFontSize: boolean;
    private _$textAreaActive: boolean;
    private _$totalWidth: number;
    private _$scrollEnabled: boolean;
    private _$scrollSprite: Sprite | null;
    private _$type: TextFieldTypeImpl;
    private _$focus: boolean;
    private _$isComposing: boolean;
    private _$thickness: number;
    private _$thicknessColor: number;
    private _$verticalAlign: TextFormatVerticalAlignImpl;
    private _$createdTextData: boolean;
    private _$cacheKeys: string[];
    private _$cacheParams: number[];

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
        this._$scrollH = 0;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$scrollV = 1;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$maxScrollV = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$maxScrollH = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxChars = 0;

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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$createdTextData = false;

        /**
         * @type {array}
         * @private
         */
        this._$textData = $getArray();

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$textHeight = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$textWidth = null;

        /**
         * @type {array}
         * @private
         */
        this._$widthTable = $getArray();

        /**
         * @type {HTMLTextAreaElement}
         * @default null
         * @private
         */
        this._$textarea = null;

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
         * @type {array}
         * @default null
         * @private
         */
        this._$heightTable = $getArray();

        /**
         * @type {array}
         * @private
         */
        this._$textFormatTable = $getArray();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$textAreaActive = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$totalWidth = 0;

        /**
         * @type {array}
         * @private
         */
        this._$objectTable = $getArray();

        /**
         * @type {array}
         * @private
         */
        this._$imageData = $getArray();

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$scrollEnabled = true;

        /**
         * @type {Sprite}
         * @default null
         * @private
         */
        this._$scrollSprite = null;

        /**
         * @type {string}
         * @default null
         * @private
         */
        this._$type = "static";

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$textHeightTable = $getArray();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$focus = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isComposing = false;

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
         * @type {string}
         * @default TextFormatVerticalAlign.TOP
         * @private
         */
        this._$verticalAlign = "top";

        /**
         * @type {Map}
         * @private
         */
        this._$heightCache = $getMap();

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
     * @default next2d.text.TextField
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.text.TextField";
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
     * @default next2d.text.TextField
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.text.TextField";
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

        this._$focus = focus;
        if (this._$focus) {

            if (this._$type === "input") {

                const player: Player = $currentPlayer();

                const div: HTMLElement | null = $document
                    .getElementById(player.contentElementId);

                if (!div) {
                    return;
                }

                this._$createTextAreaElement(player._$scale);

                // setup
                const element: HTMLTextAreaElement | null = this._$textarea;
                if (!element) {
                    return;
                }

                const matrix: Matrix = this._$transform.concatenatedMatrix;
                const bounds: BoundsImpl = this._$getBounds(null);

                const color: RGBAImpl = $intToRGBA(
                    $toColorInt(this._$defaultTextFormat.color), 100
                );

                element.style.color  = `rgb(${color.R},${color.G},${color.B})`;
                element.style.left   = `${(matrix.tx + bounds.xMin + player.x / player._$scale / $devicePixelRatio) * player._$scale}px`;
                element.style.top    = `${(matrix.ty + bounds.yMin + player.y / player._$scale / $devicePixelRatio) * player._$scale}px`;
                element.style.width  = `${$Math.ceil((this.width  - 1) * player._$scale)}px`;
                element.style.height = `${$Math.ceil((this.height - 1) * player._$scale)}px`;

                // set text
                element.value = this.text;

                div.appendChild(element);

                $requestAnimationFrame(() =>
                {
                    element.focus();
                });

                this._$doChanged();
                $doUpdated();
                this._$textAreaActive = true;

                // focus in event
                if (this.willTrigger(FocusEvent.FOCUS_IN)) {
                    this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_IN));
                }
            }

        } else {

            // execute
            if (this._$textarea) {

                this._$textarea.dispatchEvent(
                    new Event(`${$PREFIX}_blur`)
                );

                if (this.willTrigger(FocusEvent.FOCUS_OUT)) {
                    this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_OUT));
                }

                this._$textarea.remove();
            }

        }
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
        return this._$htmlText;
    }
    set htmlText (html_text: string)
    {
        if (this._$htmlText !== html_text) {
            this._$htmlText        = `${html_text}`;
            this._$rawHtmlText     = "";
            this._$text            = "";
            this._$isHTML          = true;
            this._$textFormatTable.length = 0;
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
     * TODO
     * @description scrollH の最大値です。
     *              The maximum value of scrollH.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get maxScrollH (): number
    {
        if (this._$maxScrollH === null) {
            this._$maxScrollH = 0;
        }
        return this._$maxScrollH;
    }

    /**
     * @description scrollV の最大値です。
     *              The maximum value of scrollV.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get maxScrollV (): number
    {
        if (this._$maxScrollV === null) {

            this._$maxScrollV = 1;

            this._$getTextData();

            if (!this._$textHeightTable.length) {
                return this._$maxScrollV;
            }

            const length: number = this._$textHeightTable.length;
            const maxHeight = this.height;

            if (maxHeight > this.textHeight) {
                return this._$maxScrollV;
            }

            let textHeight = 0;

            let idx: number = 0;
            while (length > idx) {

                textHeight += this._$textHeightTable[idx++];
                if (textHeight > maxHeight) {
                    break;
                }

                this._$maxScrollV++;
            }
        }
        return this._$maxScrollV;
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
        if (!this._$createdTextData) {
            this._$getTextData();
        }
        return this._$objectTable.length;
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
     * TODO
     * @description 現在の水平スクロール位置です。
     *              The current horizontal scrolling position.
     *
     * @member {number}
     * @public
     */
    get scrollH (): number
    {
        return this._$scrollH;
    }
    set scrollH (scroll_h: number)
    {
        scroll_h = $clamp(scroll_h | 0, 0, this.maxScrollH);

        if (this._$scrollH !== scroll_h) {

            this._$scrollH = scroll_h;

            this._$reset();

            if (this.willTrigger(Next2DEvent.SCROLL)) {
                this.dispatchEvent(new Next2DEvent(Next2DEvent.SCROLL, true));
            }
        }
    }

    /**
     * @description テキストフィールドのテキストの垂直位置です。
     *              The vertical position of text in a text field.
     *
     * @member {number}
     * @public
     */
    get scrollV (): number
    {
        return this._$scrollV;
    }
    set scrollV (scroll_v: number)
    {
        scroll_v = $clamp(scroll_v | 0, 1, this.maxScrollV);

        if (this._$scrollV !== scroll_v) {

            this._$scrollV = $Math.max(1, scroll_v);

            this._$reset();

            if (this._$scrollSprite && this.textHeight > this.height) {

                this._$scrollSprite.height = this.height * this.height / this.textHeight - 1;

                const parent: ParentImpl<any> = this._$parent;
                if (parent) {
                    // view start
                    this._$scrollSprite.alpha = 1;

                    // set position
                    this._$scrollSprite.x = this.x + this.width - this._$scrollSprite.width - 0.5;
                    this._$scrollSprite.y = this.y + 0.5
                        + (this.height - 1 - this._$scrollSprite.height)
                        / (this.maxScrollV - 1)
                        * (this._$scrollV - 1);

                    // added sprite
                    parent.addChildAt(
                        this._$scrollSprite,
                        parent.getChildIndex(this) + 1
                    );

                    // start animation
                    if (this._$scrollSprite.hasLocalVariable("job")) {
                        this._$scrollSprite.getLocalVariable("job").stop();
                    }

                    const job: Job = Tween.add(this._$scrollSprite,
                        { "alpha" : 1 },
                        { "alpha" : 0 },
                        1
                    );

                    job.addEventListener(Next2DEvent.COMPLETE, (event: Next2DEvent) =>
                    {
                        const sprite: Sprite = event.target.target;
                        sprite.deleteLocalVariable("job");
                        if (sprite.parent) {
                            sprite.parent.removeChild(sprite);
                        }
                    });
                    job.start();

                    this._$scrollSprite.setLocalVariable("job", job);
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

        const textData: TextDataImpl<any>[] = this._$getTextData();
        for (let idx: number = 1; idx < textData.length; ++idx) {

            const object: TextDataImpl<TextStringObjectImpl> = textData[idx];
            switch (object.mode) {

                case "text":
                    text += object.text;
                    break;

                case "break":
                    text += "\r";
                    break;

            }
        }

        this._$rawHtmlText = text;

        return text;
    }
    set text (text: string | null)
    {
        if (text === null) {
            text = "";
        }

        text = `${text}`;
        if (text !== this._$text) {
            this._$text     = text;
            this._$htmlText = "";
            this._$isHTML   = false;
            this._$textFormatTable.length = 0;
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
        if (this.text === "") {
            return 0;
        }

        if (this._$textHeight === null) {

            // setup
            this._$textHeight = 2;
            this._$getTextData();

            const length: number = this._$textHeightTable.length;
            if (length === 1) {
                this._$textHeight += this._$defaultTextFormat.leading || 0;
            }

            for (let idx: number = 0; idx < length; ++idx) {
                this._$textHeight += this._$textHeightTable[idx];
            }

        }

        return this._$textHeight;
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
        if (this._$textWidth === null) {

            // setup
            this._$textWidth = 0;
            this._$getTextData();

            for (let idx: number = 0; idx < this._$widthTable.length; ++idx) {
                this._$textWidth = $Math.max(this._$textWidth, this._$widthTable[idx]);
            }
        }

        return this._$textWidth;
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
        if (type === "static") {
            this._$textarea = null;
        }
    }

    /**
     * @description 縦方向の揃え位置を指定するプロパティです。
     *              This property specifies the vertical alignment position.
     *
     * @member {string}
     * @default TextFormatVerticalAlign.TOP
     * @public
     */
    get verticalAlign (): TextFormatVerticalAlignImpl
    {
        return this._$verticalAlign;
    }
    set verticalAlign (vertical_align: TextFormatVerticalAlignImpl)
    {
        if (vertical_align !== this._$verticalAlign) {
            this._$verticalAlign = vertical_align;
            this._$reset();
        }
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
     * @description beginIndex パラメーターと endIndex パラメーターで指定された範囲の
     *              テキストのフォーマット情報を含む TextFormat オブジェクトを返します。
     *              Returns a TextFormat object that contains formatting information
     *              for the range of text that the beginIndex and endIndex parameters specify.
     *
     * @param  {int} [begin_index=-1]
     * @param  {int} [end_index=-1]
     * @return {TextFormat}
     * @method
     * @public
     */
    getTextFormat (
        begin_index: number = -1,
        end_index: number = -1
    ): TextFormat {

        begin_index |= 0;
        end_index   |= 0;

        const data: TextDataImpl<any>[] = this._$getTextData();
        const length: number = end_index > -1 ? end_index : data.length;

        let init: boolean = false;
        let textFormat: TextFormat = new TextFormat();
        let idx: number = begin_index > -1 ? begin_index : 0;
        for ( ; idx < length; ++idx) {

            if (data[idx].mode === "break") {
                continue;
            }

            const tf: TextFormat = data[idx].textFormat;
            if (!init) {
                init = true;
                textFormat = tf._$clone();
                continue;
            }

            textFormat.align         = textFormat.align         !== tf.align         ? null : tf.align;
            textFormat.blockIndent   = textFormat.blockIndent   !== tf.blockIndent   ? null : tf.blockIndent;
            textFormat.bold          = textFormat.bold          !== tf.bold          ? null : tf.bold;
            textFormat.color         = textFormat.color         !== tf.color         ? null : tf.color;
            textFormat.font          = textFormat.font          !== tf.font          ? null : tf.font;
            textFormat.indent        = textFormat.indent        !== tf.indent        ? null : tf.indent;
            textFormat.italic        = textFormat.italic        !== tf.italic        ? null : tf.italic;
            textFormat.leading       = textFormat.leading       !== tf.leading       ? null : tf.leading;
            textFormat.leftMargin    = textFormat.leftMargin    !== tf.leftMargin    ? null : tf.leftMargin;
            textFormat.letterSpacing = textFormat.letterSpacing !== tf.letterSpacing ? null : tf.letterSpacing;
            textFormat.rightMargin   = textFormat.rightMargin   !== tf.rightMargin   ? null : tf.rightMargin;
            textFormat.size          = textFormat.size          !== tf.size          ? null : tf.size;
            textFormat.underline     = textFormat.underline     !== tf.underline     ? null : tf.underline;

        }

        return textFormat;
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
        const textData: TextDataImpl<any>[] = this._$getTextData();
        for (let idx: number = 0; idx < textData.length; idx++) {

            const obj: TextDataImpl<TextStringObjectImpl> = textData[idx];

            if (obj.yIndex > line_index) {
                break;
            }

            if (obj.yIndex !== line_index) {
                continue;
            }

            if (obj.mode !== "text") {
                continue;
            }

            lineText += obj.text;
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
     * @description format パラメーターで指定したテキストフォーマットを、
     *              テキストフィールド内の指定されたテキストに適用します。
     *              Applies the text formatting that the format parameter specifies
     *              to the specified text in a text field.
     *
     * @param  {TextFormat} text_format
     * @param  {number}     [begin_index=-1]
     * @param  {number}     [end_index=-1]
     * @return {void}
     * @method
     * @public
     */
    setTextFormat (
        text_format: TextFormat,
        begin_index: number = -1,
        end_index: number = -1
    ): void {

        // setup
        begin_index |= 0;
        end_index   |= 0;

        const textData: TextDataImpl<any>[] = this._$getTextData();

        this._$reset();

        switch (true) {

            case begin_index === -1 && end_index === -1:
                for (let idx: number = 0; idx < textData.length; ++idx) {
                    this._$textFormatTable[idx] = text_format._$clone();
                }
                break;

            case begin_index > -1 && end_index === -1:
                {
                    let idx: number = begin_index + 1;
                    let obj: TextDataImpl<TextObjectImpl> = textData[idx];
                    if (obj.mode === "wrap") {
                        obj = textData[++idx];
                    }
                    this._$textFormatTable[idx] = text_format._$clone();
                }
                break;

            case begin_index > -1 && end_index > -1 && end_index > begin_index:
                {
                    let offset: number = 0;
                    for (let idx: number = begin_index; idx < end_index; ++idx) {

                        const obj: TextObjectImpl = textData[idx];
                        if (!obj) {
                            continue;
                        }

                        if (obj.mode === "wrap" || obj.mode === "break") {
                            ++end_index;
                            --offset;
                            continue;
                        }

                        this._$textFormatTable[idx + offset] = text_format._$clone();

                    }
                }
                break;

        }

        this._$getTextData();
        this._$resize();
    }

    /**
     * @return {array}
     * @method
     * @private
     */
    _$getTextData (): TextDataImpl<any>[]
    {
        if (!this._$createdTextData) {

            this._$createdTextData = true;

            // reset
            this._$textData.length        = 0;
            this._$imageData.length       = 0;
            this._$heightTable.length     = 0;
            this._$textHeightTable.length = 0;
            this._$objectTable.length     = 0;
            this._$widthTable.length      = 0;
            this._$heightCache.clear();

            let tfCopyOffset: number = -1;
            if (this._$isHTML) {

                // html text
                let htmlText: string = this._$htmlText;

                const index: number = htmlText.search(/(< .*>|<>)/g);
                if (index > -1) {
                    htmlText = htmlText.slice(0, index);
                }

                htmlText = htmlText.replace(/\r\n/g, "\r\r");
                if ($P_TAG.innerHTML !== htmlText) {
                    $P_TAG.textContent = "";
                    $P_TAG.insertAdjacentHTML("afterbegin", htmlText);
                }

                // setup
                let tf: TextFormat = this._$defaultTextFormat;
                if (this._$textData.length in this._$textFormatTable) {
                    const tft: TextFormat = this._$textFormatTable[this._$textData.length]._$clone();
                    tft._$merge(tf);
                    tf = tft;
                }

                // init
                this._$totalWidth         = 0;
                this._$heightTable[0]     = 0;
                this._$textHeightTable[0] = this._$getTextHeight(tf);
                this._$widthTable[0]      = 0;

                const obj: TextBreakObjectImpl = {
                    "mode"       : "break",
                    "x"          : 0,
                    "yIndex"     : 0,
                    "textFormat" : tf._$clone()
                };

                this._$objectTable[0] = obj;
                this._$textData[0]    = obj;

                this._$parseTag($P_TAG, tf._$clone(), tfCopyOffset);

            } else {

                // plain text
                const texts: string[] = this._$multiline
                    ? this._$text.split("\n")
                    : [this._$text.replace("\n", "")];

                for (let idx: number = 0; idx < texts.length; ++idx) {

                    // reset
                    this._$totalWidth = 0;

                    let tf: TextFormat = this.defaultTextFormat;

                    const yIndex: number = this._$wordWrap || this._$multiline
                        ? this._$heightTable.length
                        : 0;

                    this._$heightTable[yIndex]     = 0;
                    this._$textHeightTable[yIndex] = this._$getTextHeight(tf);
                    this._$widthTable[yIndex]      = 0;

                    if (yIndex) {
                        this._$heightTable[yIndex]     = this._$heightTable[yIndex - 1];
                        this._$textHeightTable[yIndex] = this._$textHeightTable[yIndex - 1];
                    }

                    if (this._$textData.length in this._$textFormatTable) {
                        const tft: TextFormat = this._$textFormatTable[this._$textData.length]._$clone();
                        tft._$merge(tf);
                        tf = tft;
                    }

                    const obj: TextBreakObjectImpl = {
                        "mode"       : "break",
                        "x"          : 0,
                        "yIndex"     : yIndex,
                        "textFormat" : tf._$clone()
                    };

                    tf = this.defaultTextFormat;

                    this._$objectTable[yIndex] = obj;
                    this._$textData[this._$textData.length] = obj;

                    // parse text data
                    const text: string = texts[idx];
                    if (text) {
                        tfCopyOffset = this._$parseText(text, tf, tfCopyOffset);
                    }
                }
            }

            // clear
            this._$heightCache.clear();
        }

        return this._$textData;
    }

    /**
     * @param  {Element}    tag
     * @param  {TextFormat} text_format
     * @param  {number}     tf_copy_offset
     * @return {void}
     * @private
     */
    _$parseTag (
        tag: HTMLElement,
        text_format: TextFormat,
        tf_copy_offset: number
    ): void {

        const childNodes = tag.childNodes as NodeListOf<HTMLElement>;
        const length: number = childNodes.length;
        for (let idx: number = 0; idx < length; ++idx) {

            let tf: TextFormat = text_format._$clone();

            const node: HTMLElement = childNodes[idx];
            if (node.nodeType === 3) {

                tf_copy_offset = this._$parseText(
                    node.nodeValue || "", tf, tf_copy_offset
                );

                continue;

            }

            switch (node.nodeName) {

                case "P":
                    {
                        if (node.hasAttribute("align")) {
                            const align: string | null = node.getAttribute("align");
                            if (align === "center" || align === "left" || align === "right") {
                                tf.align = align;
                                if (this._$textData.length === 1) {
                                    this._$textData[0].textFormat.align = tf.align;
                                }
                            }
                        }

                        this._$parseTag(node, tf, tf_copy_offset);

                        if (!this._$multiline) {
                            break;
                        }

                        // reset
                        this._$totalWidth = this._$getImageOffsetX();

                        const yIndex: number = this._$heightTable.length;

                        this._$heightTable[yIndex]     = 0;
                        this._$textHeightTable[yIndex] = 0;
                        this._$widthTable[yIndex]      = 0;

                        if (yIndex) {
                            this._$heightTable[yIndex]     = this._$heightTable[yIndex - 1];
                            this._$textHeightTable[yIndex] = this._$textHeightTable[yIndex - 1];
                        }

                        if (this._$textData.length in this._$textFormatTable) {
                            const tft: TextFormat = this._$textFormatTable[this._$textData.length]._$clone();
                            tft._$merge(tf);
                            tf = tft;
                        }

                        const obj: TextBreakObjectImpl = {
                            "mode"      : "break",
                            "x"         : 0,
                            "yIndex"    : yIndex,
                            "textFormat": tf
                        };

                        this._$objectTable[yIndex] = obj;
                        this._$textData.push(obj);
                    }
                    break;

                case "B": // bold
                    tf.bold = true;
                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

                case "I": // italic
                    tf.italic = true;
                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

                case "U": // underline
                    tf.underline = true;
                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

                case "FONT": // FONT
                    if (node.hasAttribute("face")) {
                        tf.font = node.getAttribute("face");
                    }

                    if (node.hasAttribute("size")) {
                        const size: string | null = node.getAttribute("size");
                        if (size) {
                            tf.size = +size;
                        }
                    }

                    if (node.hasAttribute("color")) {
                        tf.color = $toColorInt(node.getAttribute("color"));
                    }

                    if (node.hasAttribute("letterSpacing")) {
                        const letterSpacing: string | null = node.getAttribute("size");
                        if (letterSpacing) {
                            tf.letterSpacing = +letterSpacing;
                        }
                    }

                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

                case "BR": // br
                    {
                        if (!this._$multiline) {
                            break;
                        }

                        // add y index
                        const yIndex: number = this._$heightTable.length;

                        this._$heightTable[yIndex]     = this._$heightTable[yIndex - 1];
                        this._$textHeightTable[yIndex] = this._$textHeightTable[yIndex - 1];
                        this._$widthTable[yIndex]      = 0;

                        // reset
                        this._$totalWidth = this._$getImageOffsetX();

                        // new clone
                        tf.indent = 0;

                        // set x offset
                        const obj: TextBreakObjectImpl = {
                            "mode"      : "break",
                            "x"         : 0,
                            "yIndex"    : yIndex,
                            "textFormat": tf
                        };

                        this._$objectTable[yIndex]              = obj;
                        this._$textData[this._$textData.length] = obj;
                    }
                    break;

                case "IMG":
                    {
                        if (!node.hasAttribute("src")) {
                            break;
                        }

                        const src: string | null = node.getAttribute("src");
                        if (!src) {
                            break;
                        }

                        let width: number = 0;
                        if (node.hasAttribute("width")) {
                            const attribute: string | null = node.getAttribute("width");
                            if (attribute) {
                                width = +attribute;
                            }
                        }

                        let height: number = 0;
                        if (node.hasAttribute("height")) {
                            const attribute: string | null = node.getAttribute("height");
                            if (attribute) {
                                height = +attribute;
                            }
                        }

                        let vspace: number = 8;
                        if (node.hasAttribute("vspace")) {
                            const attribute: string | null = node.getAttribute("vspace");
                            if (attribute) {
                                vspace = +attribute;
                            }
                        }

                        let hspace: number = 8;
                        if (node.hasAttribute("hspace")) {
                            const attribute: string | null = node.getAttribute("hspace");
                            if (attribute) {
                                hspace = +attribute;
                            }
                        }

                        let totalTextHeight: number = 0;
                        for (let idx: number = 0; idx < this._$textHeightTable.length; idx++) {
                            totalTextHeight += this._$textHeightTable[idx];
                        }

                        const image = new Image();
                        const obj: TextImageObjectImpl = {
                            "mode"      : "image",
                            "image"     : image,
                            "src"       : src,
                            "loaded"    : false,
                            "x"         : 0,
                            "y"         : totalTextHeight,
                            "width"     : width,
                            "height"    : height,
                            "hspace"    : hspace,
                            "vspace"    : vspace,
                            "textFormat": tf._$clone()
                        };

                        image.crossOrigin = "anonymous";
                        image.addEventListener("load", () =>
                        {
                            if (!obj.width) {
                                obj.width = image.width;
                            }

                            if (!obj.height) {
                                obj.height = image.height;
                            }

                            obj.loaded = true;

                            this._$reload();
                        });
                        image.src = src;

                        if (this._$imageData.length > 0) {
                            const prevImage: TextImageObjectImpl = this._$imageData[this._$imageData.length - 1];
                            const imageBottom: number = prevImage.y + prevImage.height + prevImage.vspace * 2;

                            obj.y = $Math.max(totalTextHeight, imageBottom);
                        }

                        this._$textData[this._$textData.length]   = obj;
                        this._$imageData[this._$imageData.length] = obj;
                    }
                    break;

                default:
                    this._$parseTag(node, tf, tf_copy_offset);
                    break;

            }
        }
    }

    /**
     * @param   {string} text
     * @param   {TextFormat} text_format
     * @param   {number} tf_copy_offset
     * @returns {number}
     * @method
     * @private
     */
    _$parseText (
        text: string,
        text_format: TextFormat,
        tf_copy_offset: number
    ): number {

        let yIndex: number = this._$heightTable.length - 1;

        // new format
        let tf: TextFormat = text_format._$clone();

        const matrix: Float32Array = this._$transform.concatenatedMatrix._$matrix;

        const boundsWidth: number = (this._$originBounds.xMax - this._$originBounds.xMin)
            * (matrix[0] / matrix[3]);

        $poolFloat32Array6(matrix);

        const maxWidth: number = boundsWidth - tf._$widthMargin() - 4;
        for (let idx: number = 0; idx < text.length; ++idx) {

            tf = text_format._$clone();
            if (this._$textData.length + tf_copy_offset in this._$textFormatTable) {
                const tft: TextFormat = this._$textFormatTable[this._$textData.length + tf_copy_offset]._$clone();
                tft._$merge(tf);
                tf = tft;
            }

            // reset object
            const obj: TextStringObjectImpl = {
                "mode"       : "text",
                "text"       : text[idx],
                "x"          : 0,
                "width"      : 0,
                "height"     : 0,
                "yIndex"     : yIndex,
                "textFormat" : tf
            };

            let breakCode: boolean = false;
            if (this._$multiline) {
                breakCode = obj.text === "\n" || obj.text === "\r" || obj.text === "\n\r";
            }

            const leading: number = yIndex ? tf.leading || 0 : 0;
            let width: number = 0;
            let height: number = 0;
            let textHeight: number = 0;
            let wrapObj: TextBreakObjectImpl;

            if (!$textContext) {
                continue;
            }

            $textContext.font = tf._$generateFontStyle();
            width = $textContext.measureText(obj.text || "").width;
            width += tf.letterSpacing || 0;

            height     = this._$getTextHeight(tf);
            textHeight = height + leading;
            obj.height = height;

            if (breakCode ||
                this._$wordWrap && this._$totalWidth + width > maxWidth
            ) {

                // add y index
                this._$widthTable[++yIndex] = 0;

                obj.yIndex = yIndex;

                this._$heightTable[yIndex]     = this._$heightTable[yIndex - 1];
                this._$textHeightTable[yIndex] = this._$textHeightTable[yIndex - 1];

                // reset
                this._$totalWidth = this._$getImageOffsetX();

                // new clone
                tf = tf._$clone();
                tf.indent = 0;

                // set x offset
                const mode: TextObjectModeImpl = breakCode ? "break" : "wrap";
                wrapObj = {
                    "mode"      : mode,
                    "x"         : 0,
                    "yIndex"    : yIndex,
                    "textFormat": tf
                };

                this._$objectTable[yIndex] = wrapObj;

                if (!breakCode) {
                    --tf_copy_offset;
                }

                let text: string = obj.text || "";
                let chunkLength: number = 0;
                let isSeparated: boolean = true;
                const pattern = /[0-9a-zA-Z?!;:.,？！。、；：〜]/g;

                while (text.match(pattern)) {

                    ++chunkLength;

                    const prevObj: TextStringObjectImpl = this._$textData[this._$textData.length - chunkLength];

                    if (prevObj.mode !== "text") {
                        isSeparated = false;
                        break;
                    }

                    text = prevObj.text || "";
                }

                if (chunkLength > 1 && this._$textData) {
                    const text: string = this._$textData[this._$textData.length - chunkLength + 1].text || "";
                    if (text.match(/[0-9a-zA-Z]/g)) {
                        --chunkLength;
                    }
                }

                if (chunkLength > 0 && isSeparated) {

                    const insertIdx: number = this._$textData.length - chunkLength;
                    this._$textData.splice(insertIdx, 0, wrapObj);

                    // prev line
                    let offset: number = 1;
                    let targetObj: TextStringObjectImpl = this._$textData[insertIdx - offset];

                    this._$widthTable[yIndex - 1]      = 0;
                    this._$heightTable[yIndex - 1]     = 0;
                    this._$textHeightTable[yIndex - 1] = 0;

                    while (targetObj.mode === "text") {

                        height     = this._$getTextHeight(targetObj.textFormat);
                        textHeight = height + leading;

                        this._$widthTable[yIndex - 1]     += targetObj.width || 0;
                        this._$heightTable[yIndex - 1]     = $Math.max(this._$heightTable[yIndex - 1], height);
                        this._$textHeightTable[yIndex - 1] = $Math.max(this._$textHeightTable[yIndex - 1], textHeight);

                        ++offset;
                        targetObj = this._$textData[insertIdx - offset];
                    }

                    // new line
                    offset = 1;
                    while (this._$textData.length > insertIdx + offset) {

                        targetObj = this._$textData[insertIdx + offset];
                        ++offset;

                        height     = this._$getTextHeight(targetObj.textFormat);
                        textHeight = height + leading;

                        this._$heightTable[yIndex]     = $Math.max(this._$heightTable[yIndex], height);
                        this._$textHeightTable[yIndex] = $Math.max(this._$textHeightTable[yIndex], textHeight);

                        targetObj.x      = this._$totalWidth;
                        targetObj.yIndex = yIndex;

                        this._$totalWidth += targetObj.width || 0;
                    }

                } else {

                    this._$textData[this._$textData.length] = wrapObj;

                }
            }

            if (!breakCode) {

                // width data
                obj.width          = width;
                obj.x              = this._$totalWidth;
                this._$totalWidth += width;

                if (this._$widthTable) {
                    this._$widthTable[yIndex] = $Math.max(this._$widthTable[yIndex], this._$totalWidth);
                }

                // height data
                this._$heightTable[yIndex] = $Math.max(this._$heightTable[yIndex], height);
                this._$textHeightTable[yIndex] = $Math.max(this._$textHeightTable[yIndex], textHeight);
                this._$textData[this._$textData.length] = obj;
            }

        }

        return tf_copy_offset;
    }

    /**
     * @param  {TextFormat} text_format
     * @return {number}
     * @private
     */
    _$getTextHeight (text_format: TextFormat): number
    {
        const size   = text_format.size || 0;
        const font   = text_format.font || "";
        const weight = text_format.bold ? "bold" : "normal";

        // use cache
        const key = `${size}_${font}_${weight}`;
        if (this._$heightCache.has(key)) {
            return this._$heightCache.get(key) || 0;
        }

        // update dom data
        const style: CSSStyleDeclaration = $DIV.style;

        const fontSize = `${size}px`;
        if (style.fontSize !== fontSize) {
            style.fontSize = fontSize;
        }
        if (style.fontFamily !== font) {
            style.fontFamily = font;
        }
        if (style.fontWeight !== weight) {
            style.fontWeight = weight;
        }

        const height: number = 10 > size
            ? $DIV.clientHeight * size * 0.1
            : $DIV.clientHeight;

        // cache
        this._$heightCache.set(key, height);

        return height;
    }

    /**
     * @return {number}
     * @private
     */
    _$getImageOffsetX (): number
    {
        if (!this._$imageData.length) {
            return 0;
        }

        let totalTextHeight: number = 0;
        for (let idx: number = 0; idx < this._$textHeightTable.length; ++idx) {
            totalTextHeight += this._$textHeightTable[idx];
        }

        if (this._$imageData) {
            for (let idx: number = 0; idx < this._$imageData.length; ++idx) {

                const image: TextDataImpl<TextImageObjectImpl> = this._$imageData[idx];

                const imageHeight = image.height + image.vspace * 2;

                if (image.y <= totalTextHeight
                    && totalTextHeight < image.y + imageHeight
                ) {
                    return image.width + image.hspace * 2;
                }
            }
        }

        return 0;
    }

    /**
     * @return {void}
     * @method
     * @private
     */
    _$reset (): void
    {
        this._$createdTextData        = false;
        this._$textData.length        = 0;
        this._$imageData.length       = 0;
        this._$heightTable.length     = 0;
        this._$textHeightTable.length = 0;
        this._$widthTable.length      = 0;
        this._$objectTable.length     = 0;

        this._$textHeight      = null;
        this._$textWidth       = null;
        this._$totalWidth      = 0;
        this._$maxScrollH      = null;
        this._$maxScrollV      = null;

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
        this._$getTextData();

        if (this._$autoSize === "none" && this._$autoFontSize) {

            let fontSize: number = this._$defaultTextFormat.size || 0;

            const cacheSize: number = fontSize;
            if (this.width && this.textWidth
                && this.textWidth > this.width
            ) {

                while (this.textWidth > this.width) {

                    this._$defaultTextFormat.size = fontSize--;
                    if (1 > fontSize) {
                        this._$defaultTextFormat.size = 1;
                        break;
                    }

                    this._$reset();
                    this._$getTextData();
                }

            }

            if (this.height && this.textHeight
                && this.textHeight > this.height
            ) {

                while (this.textHeight > this.height) {

                    this._$defaultTextFormat.size = fontSize--;
                    if (1 > fontSize) {
                        this._$defaultTextFormat.size = 1;
                        break;
                    }

                    this._$reset();
                    this._$getTextData();
                }

            }

            // restore
            this._$defaultTextFormat.size = cacheSize;
        }

        this._$resize();
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
            this._$bounds.yMax = this.textHeight
                + 4 + this._$originBounds.yMin;

        } else {

            if (this._$scrollEnabled && !this._$scrollSprite) {
                this._$scrollSprite = new Sprite();

                const shape: Shape = new Shape();
                
                shape
                    .graphics
                    .beginFill("#000", 0.3)
                    .drawRoundRect(0, 0, 3, 3, 3);
                shape.scale9Grid = new Rectangle(1.5, 1.5, 0.1, 0.1);

                this._$scrollSprite.addChild(shape);
            }
        }
    }

    /**
     * @param  {object} obj
     * @param  {number} width
     * @return {number}
     * @private
     */
    _$getAlignOffset (obj: TextDataImpl<any>, width: number): number
    {

        // default
        const totalWidth: number = this._$widthTable[obj.yIndex];
        const textFormat: TextFormat = obj.textFormat;

        let indent = 0;
        indent += textFormat.blockIndent || 0;
        indent += textFormat.leftMargin || 0;

        const rightMargin: number = textFormat.rightMargin || 0;
        switch (true) {

            // wordWrap case
            case !this._$wordWrap && totalWidth > width:
                return $Math.max(0, indent);

            case textFormat.align === "center": // format CENTER
            case this._$autoSize === "center": // autoSize CENTER
                return $Math.max(0, width / 2 - indent - rightMargin - totalWidth / 2);

            case textFormat.align === "right": // format RIGHT
            case this._$autoSize === "right": // autoSize RIGHT
                return $Math.max(0, width - indent - totalWidth - rightMargin - 2);

            // autoSize LEFT
            // format LEFT
            default:
                return $Math.max(0, indent + 2);

        }
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

        if (!this._$visible || this._$textAreaActive) {
            return ;
        }

        if (!this._$background && !this._$border && !this.text) {
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
            const lineWidth: number  = $Math.min(1, $Math.max(xScale, yScale));
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

            ctx.beginPath();
            ctx.setTransform(xScale, 0, 0, yScale, 0, 0);
            this._$doDraw(ctx, matrix, multiColor, width / xScale);
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
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @param  {number} width
     * @return {void}
     * @method
     * @private
     */
    _$doDraw (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        color_transform: Float32Array,
        width: number
    ): void {

        // init
        const textData: TextDataImpl<any>[] = this._$getTextData();

        const limitWidth: number  = this.width;
        const limitHeight: number = this.height;

        // setup
        let xOffset: number      = 0;
        let offsetHeight: number = 0;
        let currentV: number     = 0;

        let yOffset: number = 0;
        if (this._$verticalAlign !== "top"
            && this.height > this.textHeight
        ) {

            switch (this._$verticalAlign) {

                case "middle":
                    yOffset = (this.height - this.textHeight + 2) / 2;
                    break;

                case "bottom":
                    yOffset = this.height - this.textHeight + 2;
                    break;

            }

        }

        for (let idx: number = 0; idx < textData.length; ++idx) {

            const obj: TextDataImpl<any> = textData[idx];
            if (obj.width === 0) {
                continue;
            }

            // check
            const offsetWidth = xOffset + obj.x;
            if (this._$autoSize === "none"
                && (offsetHeight > limitHeight || offsetWidth > limitWidth)
            ) {
                continue;
            }

            const tf: TextFormat = obj.textFormat;

            // color
            const rgb: RGBAImpl = $intToRGBA(tf.color || 0);
            const alpha: number = $Math.max(0, $Math.min(
                rgb.A * 255 + color_transform[7], 255)
            ) / 255;

            context.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

            if (this._$thickness) {
                const rgb: RGBAImpl = $intToRGBA(this._$thicknessColor);
                const alpha: number = $Math.max(0, $Math.min(
                    rgb.A * 255 + color_transform[7], 255)
                ) / 255;
                context.lineWidth   = this._$thickness;
                context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
            }

            const yIndex: number = obj.yIndex | 0;
            switch (obj.mode) {

                case "break":
                case "wrap":

                    currentV++;

                    if (this.scrollV > currentV) {
                        continue;
                    }

                    offsetHeight += this._$textHeightTable[yIndex];

                    xOffset = this._$getAlignOffset(this._$objectTable[yIndex], width);
                    if (tf.underline) {

                        const offset: number = tf.size ? tf.size / 12 : 0;

                        const rgb: RGBAImpl = $intToRGBA(tf.color || 0);
                        const alpha: number = $Math.max(0, $Math.min(
                            rgb.A * 255 + color_transform[7], 255)
                        ) / 255;

                        context.lineWidth   = $Math.max(1, 1 / $Math.min(matrix[0], matrix[3]));
                        context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

                        context.beginPath();
                        context.moveTo(xOffset, yOffset + offsetHeight - offset);
                        context.lineTo(xOffset + this._$widthTable[yIndex], yOffset + offsetHeight - offset);
                        context.stroke();

                    }

                    break;

                case "text":
                    {
                        if (this.scrollV > currentV) {
                            continue;
                        }

                        let offsetY: number = offsetHeight - this._$heightTable[0];
                        if (!$isSafari && tf.size) {
                            offsetY += $devicePixelRatio * (tf.size / 12);
                        }

                        context.beginPath();
                        context.textBaseline = "top";
                        context.font = $generateFontStyle(
                            tf.font || "", tf.size || 0, !!tf.italic, !!tf.bold
                        );

                        if (this._$thickness) {
                            context.strokeText(obj.text, offsetWidth, yOffset + offsetY);
                        }

                        context.fillText(obj.text, offsetWidth, yOffset + offsetY);

                    }
                    break;

                case "image":

                    if (!obj.loaded) {
                        continue;
                    }

                    context.beginPath();
                    context.drawImage(obj.image,
                        obj.hspace, yOffset + obj.y,
                        obj.width, obj.height
                    );

                    break;

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
     * @param  {number} scale
     * @return {void}
     * @method
     * @private
     */
    _$createTextAreaElement (scale: number): void
    {
        // new text area
        if (!this._$textarea) {

            this._$textarea = $document.createElement("textarea");
            this._$textarea.value = this.text;
            this._$textarea.id    = `${$PREFIX}_TextField_${this._$instanceId}`;

            if (!this._$wordWrap) {
                this._$textarea.wrap = "off";
            }

            const textFormat: TextFormat = this._$defaultTextFormat;

            // setup
            let style = "";
            style += "position: absolute;";
            style += "outline: 0;";
            style += `padding: 2px 2px 2px ${$Math.max(3, textFormat.leftMargin || 0)}px;`;
            style += "margin: 0;";
            style += "appearance: none;";
            style += "resize: none;";
            style += "overflow: hidden;";
            style += `z-index: ${0x7fffffff};`;
            style += "vertical-align: top;";

            this._$textarea.setAttribute("style", style);

            // add blur event
            this._$textarea.addEventListener(`${$PREFIX}_blur`, (event: Event) =>
            {
                // set new text
                const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;

                let value: string = element.value;
                if (value && this._$restrict) {

                    let pattern: string = this._$restrict;

                    if (pattern[0] !== "[") {
                        pattern = "[" + pattern;
                    }

                    if (pattern[pattern.length - 1] !== "]") {
                        pattern += "]";
                    }

                    const found: RegExpMatchArray | null = value.match(new $RegExp(pattern, "gm"));
                    value = found ? found.join("") : "";
                }

                const player: Player = $currentPlayer();

                const div:HTMLElement | null = $document.getElementById(
                    player.contentElementId
                );

                if (div) {

                    const element = $document.getElementById(
                        `${$PREFIX}_TextField_${this._$instanceId}`
                    );

                    if (element) {
                        element.remove();
                    }
                }

                this.text = value;
                this._$focus = false;
                this._$textAreaActive = false;

                this._$doChanged();
                $doUpdated();
            });

            // input event
            this._$textarea.addEventListener("input", (event: InputEvent) =>
            {
                // set new text
                const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;

                const player: Player = $currentPlayer();

                let value: string = element.value;

                // SafariではInputEvent.isComposingがundefined
                if (this._$restrict && !this._$isComposing && value) {

                    let pattern: string = this._$restrict;

                    if (pattern[0] !== "[") {
                        pattern = "[" + pattern;
                    }

                    if (pattern[pattern.length - 1] !== "]") {
                        pattern += "]";
                    }

                    const found: RegExpMatchArray | null = value.match(new $RegExp(pattern, "gm"));
                    value = found ? found.join("") : "";
                }

                if (!this._$isComposing && this.text !== value) {

                    // update
                    this.text = value;
                    element.value = value;

                    if (this.willTrigger(Next2DEvent.CHANGE)) {
                        this.dispatchEvent(new Next2DEvent(Next2DEvent.CHANGE, true));
                    }

                    // setup
                    // const element = this._$textarea;
                    const matrix: Matrix = this._$transform.concatenatedMatrix;
                    const bounds: BoundsImpl = this._$getBounds(null);

                    element.style.left   = `${$Math.floor((matrix.tx + bounds.xMin + player.x / player._$scale / $devicePixelRatio) * player._$scale)}px`;
                    element.style.top    = `${$Math.floor((matrix.ty + bounds.yMin + player.y / player._$scale / $devicePixelRatio) * player._$scale)}px`;
                    element.style.width  = `${$Math.ceil((this.width  - 1) * player._$scale)}px`;
                    element.style.height = `${$Math.ceil((this.height - 1) * player._$scale)}px`;
                }

            });

            // IME入力開始時のevent
            this._$textarea.addEventListener("compositionstart", () =>
            {
                this._$isComposing = true;
            });

            // IME入力確定時のevent
            this._$textarea.addEventListener("compositionend", (event: Event) =>
            {
                this._$isComposing = false;

                const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;

                let value = element.value;
                if (!this._$restrict || !value) {
                    return;
                }

                let pattern: string = this._$restrict;

                if (pattern[0] !== "[") {
                    pattern = "[" + pattern;
                }

                if (pattern[pattern.length - 1] !== "]") {
                    pattern += "]";
                }

                const found: RegExpMatchArray | null = value.match(new $RegExp(pattern, "gm"));
                value = found ? found.join("") : "";

                // update
                this.text = value;
                element.value = value;
            });

            // add click event
            this._$textarea.addEventListener("click", () =>
            {
                if (this.willTrigger(Next2DMouseEvent.CLICK)) {
                    this.dispatchEvent(new Next2DMouseEvent(Next2DMouseEvent.CLICK));
                }
            });

            // add mousewheel event
            this._$textarea.addEventListener($MOUSE_WHEEL, (event: WheelEvent) =>
            {
                this.scrollV += event.deltaY;
            });

            // add scroll event
            this._$textarea.addEventListener($SCROLL, (event: Event) =>
            {
                const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;

                this.scrollV = element.scrollTop
                    / (element.scrollHeight - element.clientHeight)
                    * this.maxScrollV + 1;
            });

            // down event
            this._$textarea.addEventListener($TOUCH_START, () =>
            {
                const player: Player = $currentPlayer();
                player._$state = "down";
            });

            // up event
            this._$textarea.addEventListener($TOUCH_END, () =>
            {
                const player: Player = $currentPlayer();
                player._$state = "up";
            });

            // down event
            this._$textarea.addEventListener($MOUSE_DOWN, () =>
            {
                const player: Player = $currentPlayer();
                player._$state = "down";
            });

            // up event
            this._$textarea.addEventListener($MOUSE_UP, () =>
            {
                const player: Player = $currentPlayer();
                player._$state = "up";
            });

        }

        // change style
        const tf: TextFormat = this._$defaultTextFormat;

        const fontSize: number = tf.size
            ? $Math.ceil(tf.size * scale * this._$transform.concatenatedMatrix.d)
            : 0;

        this._$textarea.style.fontSize   = `${fontSize}px`;
        this._$textarea.style.fontFamily = tf.font || "Times New Roman";
        this._$textarea.style.lineHeight = `${(fontSize + $Math.max(0, tf.leading || 0)) / fontSize}em`;

        if (this._$autoSize !== "none") {
            this._$textarea.style.textAlign = "center";
        } else {
            this._$textarea.style.textAlign = tf.align || "none";
        }

        this._$textarea.addEventListener("keydown", (event: KeyboardEvent) =>
        {
            const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
            let value: string = element.value;

            // SafariではInputEvent.isComposingがundefined
            if (this._$restrict && !this._$isComposing && value) {

                let pattern: string = this._$restrict;

                if (pattern[0] !== "[") {
                    pattern = "[" + pattern;
                }

                if (pattern[pattern.length - 1] !== "]") {
                    pattern += "]";
                }

                const found: RegExpMatchArray | null = value.match(new $RegExp(pattern, "gm"));
                value = found ? found.join("") : "";
            }

            // update
            if (!this._$isComposing) {
                this.text = value;
                element.value = value;
            }

            // enter off
            if (event.code === "Enter" && !this._$multiline) {
                return false;
            }
        });

        const style: CSSStyleDeclaration = this._$textarea.style;
        if (this._$border) {
            style.border = `solid 1px #${this.borderColor.toString(16)}`;
        } else {
            style.border = "none";
        }

        if (this._$border || this._$background) {
            style.backgroundColor = `#${this.backgroundColor.toString(16)}`;
        } else {
            style.backgroundColor = "transparent";
        }

        //reset
        this._$textarea.maxLength = this._$maxChars ? this._$maxChars : 0x7fffffff;
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
            "textData": this._$getTextData(),
            "scrollV": this.scrollV,
            "widthTable": this._$widthTable,
            "heightTable": this._$heightTable,
            "textHeightTable": this._$textHeightTable,
            "objectTable": this._$objectTable,
            "limitWidth": this.width,
            "limitHeight": this.height,
            "textHeight": this.textHeight,
            "verticalAlign": this._$verticalAlign,
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

        message.textAreaActive = this._$textAreaActive;

        const bounds: BoundsImpl = this._$getBounds(null);
        message.xMin = bounds.xMin;
        message.yMin = bounds.yMin;
        message.xMax = bounds.xMax;
        message.yMax = bounds.yMax;
        $poolBoundsObject(bounds);

        if (this._$isUpdated()) {

            message.textData        = this._$getTextData();
            message.scrollV         = this.scrollV;
            message.widthTable      = this._$widthTable;
            message.heightTable     = this._$heightTable;
            message.textHeightTable = this._$textHeightTable;
            message.objectTable     = this._$objectTable;
            message.limitWidth      = this.width;
            message.limitHeight     = this.height;
            message.textHeight      = this.textHeight;
            message.verticalAlign   = this._$verticalAlign;
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
