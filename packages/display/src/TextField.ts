import { Player } from "@next2d/core";
import {
    InteractiveObject,
    Shape
} from "@next2d/display";
import {
    FocusEvent,
    Event as Next2DEvent,
    MouseEvent as Next2DMouseEvent
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
    Matrix
} from "@next2d/geom";
import {
    BoundsImpl,
    TextFieldTypeImpl,
    TextFormatVerticalAlignImpl,
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
import {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    $currentPlayer,
    $MOUSE_DOWN,
    $MOUSE_UP,
    $MOUSE_WHEEL,
    $PREFIX,
    $rendererWorker,
    $SCROLL,
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
    private _$restrict: string;
    private _$isHTML: boolean;
    private _$textarea: HTMLTextAreaElement | null;
    private _$autoSize: TextFieldAutoSizeImpl;
    private _$autoFontSize: boolean;
    private _$textAreaActive: boolean;
    private _$scrollEnabled: boolean;
    private _$xScrollShape: Shape | null;
    private _$yScrollShape: Shape | null;
    private _$type: TextFieldTypeImpl;
    private _$focus: boolean;
    private _$isComposing: boolean;
    private _$thickness: number;
    private _$thicknessColor: number;
    private _$verticalAlign: TextFormatVerticalAlignImpl;
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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$textAreaActive = false;

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
         * @default "bottom"
         * @private
         */
        this._$verticalAlign = "bottom";

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

        this._$focus = focus;
        if (this._$focus) {

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
            element.style.width  = `${$Math.ceil(this.width  * player._$scale)}px`;
            element.style.height = `${$Math.ceil(this.height * player._$scale)}px`;

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

        scroll_x = $clamp(scroll_x, 0, this.width, 0);
        if (this._$scrollX !== scroll_x) {

            const width: number = this.width;
            if (this._$xScrollShape && this.textWidth > width) {

                this._$doChanged();

                this._$scrollX = scroll_x;

                this._$xScrollShape.width = width * width / this.textWidth;
                const parent: ParentImpl<any> = this._$parent;
                if (parent) {

                    // view start
                    Tween.add(this._$xScrollShape,
                        { "alpha" : 0 },
                        { "alpha" : 0.8 },
                        0, 0.3, Easing.outQuad
                    );

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

                    // start animation
                    if (this._$xScrollShape.hasLocalVariable("job")) {
                        this._$xScrollShape.getLocalVariable("job").stop();
                    }

                    const job: Job = Tween.add(this._$xScrollShape,
                        { "alpha" : 0.8 },
                        { "alpha" : 0 },
                        0.2, 0.6, Easing.outQuad
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

                    // view start
                    Tween.add(this._$yScrollShape,
                        { "alpha" : 0 },
                        { "alpha" : 0.8 },
                        0, 0.3, Easing.outQuad
                    );

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

                    // start animation
                    if (this._$yScrollShape.hasLocalVariable("job")) {
                        this._$yScrollShape.getLocalVariable("job").stop();
                    }

                    const job: Job = Tween.add(this._$yScrollShape,
                        { "alpha" : 0.8 },
                        { "alpha" : 0 },
                        0.2, 0.6, Easing.outQuad
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

            const object: TextObjectImpl = textData.textTable[idx];
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
        if (type === "static") {
            this._$textarea = null;
        }
    }

    /**
     * @description 縦方向の揃え位置を指定するプロパティです。
     *              This property specifies the vertical alignment position.
     *
     * @member {string}
     * @default "bottom"
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
                    "subFontSize": sub_font_size
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
                    "subFontSize": sub_font_size
                }
            );

        }

        return this._$textData;
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

        const leftMargin: number  = textFormat.leftMargin  || 0;
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

            let ty = 2;
            if (this._$scrollY > 0) {
                const scaleY: number = (this.textHeight - this.height) / this.height;
                ty += -this._$scrollY * scaleY;
            }

            let tx = 2;
            if (this._$scrollX > 0) {
                const scaleX: number = (this.textWidth - this.width) / this.width;
                tx += -this._$scrollX * scaleX;
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
        for (let idx: number = 0; idx < textData.textTable.length; ++idx) {

            const textObject: TextObjectImpl = textData.textTable[idx];
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
                        offsetHeight += textData.heightTable[line - 1] + 1;
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
                            textFormat.font || "", textFormat.size || 0, !!textFormat.italic, !!textFormat.bold
                        );

                        const x: number = offsetWidth + offsetAlign;
                        const y: number = offsetHeight + verticalAlign;
                        if (textFormat.underline) {

                            const rgb: RGBAImpl = $intToRGBA(textFormat.color || 0);
                            const alpha: number = $Math.max(0, $Math.min(
                                rgb.A * 255 + color_transform[7], 255)
                            ) / 255;

                            context.lineWidth   = line_width;
                            context.strokeStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;

                            context.beginPath();
                            context.moveTo(x, y + 1);
                            context.lineTo(x + textObject.w, y + 1);
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
                this.scrollY += event.deltaY;
            });

            // add scroll event
            this._$textarea.addEventListener($SCROLL, (event: Event) =>
            {
                const element: HTMLTextAreaElement = event.target as HTMLTextAreaElement;

                this.scrollY = element.scrollTop;
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
