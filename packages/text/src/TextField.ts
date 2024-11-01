import type { IBounds } from "./interface/IBounds";
import type { ITextFieldAutoSize } from "./interface/ITextFieldAutoSize";
import type { ITextFieldType } from "./interface/ITextFieldType";
import type { ITextObject } from "./interface/ITextObject";
import { TextData } from "./TextData";
import { TextFormat } from "./TextFormat";
import { execute as textFormatSetDefaultService } from "./TextFormat/service/TextFormatSetDefaultService";
import { execute as textFormatHtmlTextGenerateStyleService } from "./TextFormat/service/TextFormatHtmlTextGenerateStyleService";
import { execute as textFieldGetTextDataUseCase } from "./TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldResetUseCase } from "./TextField/usecase/TextFieldResetUseCase";
import { execute as textFieldReloadUseCase } from "./TextField/usecase/TextFieldReloadUseCase";
import { execute as textFieldUpdateStopIndexUseCase } from "./TextField/usecase/TextFieldUpdateStopIndexUseCase";
import { execute as textFieldSetFocusUseCase } from "./TextField/usecase/TextFieldSetFocusUseCase";
import {
    $clamp,
    $toColorInt
} from "./TextUtil";
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
    Easing
} from "@next2d/ui";
import {
    Rectangle,
    Matrix,
    Point
} from "@next2d/geom";

/**
 * @description TextField クラスは、テキストの表示と入力用の表示オブジェクトを作成するために使用されます。
 *              プロパティインスペクターを使用して、テキストフィールドにインスタンス名を付けることができます。
 *              また、TextField クラスのメソッドとプロパティを使用して、JavaScript でテキストフィールドを操作できます。
 *
 *              The TextField class is used to create display objects for text display and input.
 *              You can give a text field an instance name in the Property inspector
 *              nd use the methods and properties of the TextField class to manipulate it with JavaScript.
 *
 * @class
 * @memberOf next2d.display
 * @extends  InteractiveObject
 */
export class TextField extends InteractiveObject
{
    /**
     * @description TextFieldの機能を所持しているかを返却
     *              Returns whether the display object has TextField functionality.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isText: boolean;

    /**
     * @description セットされたテキストを描画用に分解したデータ
     *              Data that breaks down the set text for drawing
     * 
     * @member {TextData}
     * @protected
     */
    public $textData: TextData | null;

    /**
     * @description テキストが HTML であるかどうかを示します。
     *              Indicates whether the text is HTML.
     * 
     * @member {boolean}
     * @private
     */
    private _$isHTML: boolean;

    /**
     * @description バウンディングボックスのxMin座標
     *              Bounding box coordinates
     * 
     * @member {number}
     * @public
     */
    public xMin: number;

    /**
     * @description バウンディングボックスのyMin座標
     *              Bounding box coordinates
     * 
     * @member {number}
     * @public
     */
    public yMin: number;

    /**
     * @description バウンディングボックスのxMax座標
     *              Bounding box coordinates
     * 
     * @member {number}
     * @public
     */
    public xMax: number;

    /**
     * @description バウンディングボックスのyMax座標
     *              Bounding box coordinates
     * 
     * @member {number}
     * @public
     */
    public yMax: number;

    /**
     * @description テキストフィールドの描画範囲のバウンディングボックス
     *              The bounding box of the drawing area of the text field
     * 
     * @member {IBounds}
     * @private
     */
    public readonly bounds: IBounds;

    /**
     * @description スクロール機能のON/OFFの制御。
     *              Control ON/OFF of the scroll function.
     *
     * @member  {boolean}
     * @default true
     * @public
     */
    public scrollEnabled: boolean;

    /**
     * @description xスクロールバーの表示用の Shape オブジェクト
     *              Shape object for x scroll bar display
     * 
     * @member {Shape | null}
     * @protected
     */
    public xScrollShape: Shape | null;

    /**
     * @description yスクロールバーの表示用の Shape オブジェクト
     *              Shape object for y scroll bar display
     * 
     * @member {Shape | null}
     * @protected
     */
    public yScrollShape: Shape | null;

    /**
     * @description テキストフィールドの点滅線の表示・非表示を制御します。
     *              Controls the visibility of the text field's blinking line.
     * 
     * @member {boolean}
     * @default false
     * @public
     */
    public focusVisible: boolean;

    /**
     * @description テキストフィールドのフォーカス位置のインデックス
     *              Index of the focus position of the text field
     * 
     * @member {number}
     * @default -1
     * @public
     */
    public focusIndex: number;

    /**
     * @description テキストフィールドの選択位置のインデックス
     *              Index of the selected position of the text field
     * 
     * @member {number}
     * @default -1
     * @public
     */
    public selectIndex: number;

    /**
     * @description ユーザーが入力するときに、テキストフィールドに入力できる最大の文字数です。
     *              The maximum number of characters that the text field can contain,
     *              as entered by a user.
     *
     * @member {number}
     * @default 0
     * @public
     */
    public maxChars: number;

    /**
     * @description ユーザーがテキストフィールドに入力できる文字のセットを指定します。
     *              Indicates the set of characters that a user can enter into the text field.
     *
     * @member {string}
     * @default null
     * @public
     */
    public restrict: string;

    /**
     * @description テキストフィールドのタイプです。
     *              The type of the text field.
     *
     * @member {string}
     * @default TextFieldType.STATIC
     * @public
     */
    public type: ITextFieldType;


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
    private _$defaultTextFormat: TextFormat;
    private _$rawHtmlText: string;
    private _$textFormats: TextFormat[] | null;
    private _$autoSize: ITextFieldAutoSize;
    private _$autoFontSize: boolean;
    private _$focus: boolean;
    private _$copyText: string;
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
    constructor ()
    {
        super();

        this.isText = true;

        /**
         * @type {TextData}
         * @default null
         * @public
         */
        this.$textData = null;

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
         * @public
         */
        this.maxChars = 0;

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
        textFormatSetDefaultService(textFormat);

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
         * @type {number}
         * @default 0
         * @public
         */
        this.xMin = 0;
        this.yMin = 0;
        this.xMax = 100;
        this.yMax = 100;
        this.bounds = {
            "xMin": 0 ,
            "xMax": this.xMax,
            "yMin": 0 ,
            "yMax": this.yMax
        };

        /**
         * @type {string}
         * @default null
         * @private
         */
        this.restrict = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$isHTML = false;

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
        this.focusVisible = false;

        /**
         * @type {number}
         * @default -1
         * @public
         */
        this.focusIndex = -1;

        /**
         * @type {number}
         * @default -1
         * @public
         */
        this.selectIndex = -1;

        /**
         * @type {boolean}
         * @default true
         * @public
         */
        this.scrollEnabled = true;

        /**
         * @type {Shape}
         * @public
         */
        this.xScrollShape = new Shape();
        this
            .xScrollShape
            .graphics
            .beginFill("#000", 0.3)
            .drawRoundRect(0, 0, 3, 3, 3);

        this
            .xScrollShape
            .scale9Grid = new Rectangle(1.5, 1.5, 0.1, 0.1);

        /**
         * @type {Shape}
         * @public
         */
        this.yScrollShape = new Shape();
        this
            .yScrollShape
            .graphics
            .beginFill("#000", 0.3)
            .drawRoundRect(0, 0, 3, 3, 3);

        this
            .yScrollShape
            .scale9Grid = new Rectangle(1.5, 1.5, 0.1, 0.1);

        /**
         * @type {string}
         * @default "static"
         * @public
         */
        this.type = "static";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$focus = false;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$copyText = "";

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
        this._$cacheKeys = [];

        /**
         * @type {array}
         * @private
         */
        this._$cacheParams = [];
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
        if (auto_font_size === this._$autoFontSize) {
            return ;
        }
        this._$autoFontSize = !!auto_font_size;
        textFieldReloadUseCase(this);
    }

    /**
     * @description テキストフィールドの自動的な拡大 / 縮小および整列を制御します。
     *              Controls automatic sizing and alignment of text fields.
     *
     * @member {string}
     * @default "none"
     * @public
     */
    get autoSize (): ITextFieldAutoSize
    {
        return this._$autoSize;
    }
    set autoSize (auto_size: ITextFieldAutoSize)
    {
        if (auto_size === this._$autoSize) {
            return ;
        }
        this._$autoSize = auto_size;
        textFieldReloadUseCase(this);
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
        if (background === this._$background) {
            return ;
        }
        this._$background = !!background;
        textFieldResetUseCase(this);
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

        if (background_color === this._$backgroundColor) {
            return ;
        }

        this._$backgroundColor = background_color;
        textFieldResetUseCase(this);
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
        if (border === this._$border) {
            return ;
        }

        this._$border = !!border;
        textFieldResetUseCase(this);
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

        if (border_color === this._$borderColor) {
            return ;
        }

        this._$borderColor = border_color;
        textFieldResetUseCase(this);
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

        const point = textFieldUpdateStopIndexUseCase(this, index);
        if (point) {
            this._$scrollX = point.x;
            this._$scrollY = point.y;
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
        return this._$defaultTextFormat.clone();
    }
    set defaultTextFormat (text_format: TextFormat)
    {
        this._$defaultTextFormat = text_format;
        textFieldResetUseCase(this);
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

        if (this.type !== "input") {
            return ;
        }

        this._$focus = !!focus;
    
        textFieldSetFocusUseCase(
            this, this._$focus ? FocusEvent.FOCUS_IN : FocusEvent.FOCUS_OUT
        );
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

        const style = textFormatHtmlTextGenerateStyleService(this.defaultTextFormat);
        this._$htmlText = `<span style="${style}">${this._$text.replace(/\n/g, "<br>")}</span>`;

        return this._$htmlText;
    }
    set htmlText (html_text: string)
    {
        if (this._$htmlText === html_text) {
            return ;
        }

        this._$htmlText    = `${html_text}`;
        this._$rawHtmlText = "";
        this._$text        = "";
        this._$isHTML      = true;
        textFieldReloadUseCase(this);
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
            textFieldResetUseCase(this);
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
        const textData = textFieldGetTextDataUseCase(this);
        return textData.lineTable.length;
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
        if (!this.scrollEnabled
            || this.autoSize !== "none"
        ) {
            return ;
        }

        // check y animation
        if (this.yScrollShape
            && this.yScrollShape.hasLocalVariable("job")
        ) {
            return ;
        }

        scroll_x = $clamp(scroll_x, 0, this.width + 0.5, 0);
        if (this._$scrollX !== scroll_x) {

            const width: number = this.width;
            if (this.xScrollShape && this.textWidth > width) {

                this._$doChanged();

                this._$scrollX = scroll_x;

                this.xScrollShape.width = width * width / this.textWidth;
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

                    const job = Tween.add(this._$xScrollShape,
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
        if (!this.scrollEnabled
            || this.autoSize !== "none"
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

                    const job = Tween.add(this._$yScrollShape,
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

        const textData = textFieldGetTextDataUseCase(this);
        for (let idx = 1; idx < textData.textTable.length; ++idx) {

            const textObject = textData.textTable[idx];
            if (!textObject) {
                continue;
            }

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

        return this._$rawHtmlText;
    }
    set text (text: string | null)
    {
        if (text === null) {
            this._$text        = "";
            this._$htmlText    = "";
            this._$rawHtmlText = "";
            this._$isHTML      = false;
            textFieldReloadUseCase(this);
            return ;
        }

        text = `${text}`;
        if (text !== this._$text) {
            this._$text        = text;
            this._$htmlText    = "";
            this._$rawHtmlText = "";
            this._$isHTML      = false;
            textFieldReloadUseCase(this);
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
        textFieldReloadUseCase(this);
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
        const textData = textFieldGetTextDataUseCase(this);
        return textData.textHeight;
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
        const textData = textFieldGetTextDataUseCase(this);
        return textData.textWidth;
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
            textFieldResetUseCase(this);
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
            textFieldResetUseCase(this);
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
            textFieldResetUseCase(this);
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

            const bounds: IBounds = this._$getBounds(null);

            const xMin: number = Math.abs(bounds.xMin);
            this._$originBounds.xMax = width + xMin;
            this._$originBounds.xMin = xMin;
            this._$bounds.xMax = this._$originBounds.xMax;
            this._$bounds.xMin = this._$originBounds.xMin;

            super.width = width;

            textFieldReloadUseCase(this);
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

            const bounds: IBounds = this._$getBounds(null);

            const yMin: number = Math.abs(bounds.yMin);
            this._$originBounds.yMax = height + yMin;
            this._$bounds.yMax = this._$originBounds.yMax;
            this._$bounds.yMin = this._$originBounds.yMin;
            super.height = height;

            textFieldReloadUseCase(this);
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
        const bounds: IBounds = this._$getBounds(null);
        return matrix._$matrix[4] + bounds.xMin;
    }
    set x (x: number)
    {
        const bounds: IBounds = this._$getBounds(null);
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
        const bounds: IBounds = this._$getBounds(null);
        return matrix._$matrix[5] + bounds.yMin;
    }
    set y (y: number)
    {
        const bounds: IBounds = this._$getBounds(null);
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
        const currentText = this.text;
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
        const textData: TextData = textFieldGetTextDataUseCase(this);
        for (let idx: number = 0; idx < textData.textTable.length; idx++) {

            const textObject: ITextObject = textData.textTable[idx];

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
     * @return {void}
     * @method
     * @public
     */
    selectAll (): void
    {
        const textData: TextData = textFieldGetTextDataUseCase(this);
        if (!textData.textTable.length) {
            return ;
        }

        this.selectIndex = 1;
        this.focusIndex  = textData.textTable.length;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    copy (): void
    {
        if (this.focusIndex === -1 || this.selectIndex === -1) {
            return ;
        }

        let text: string = "";
        const minIndex: number = Math.min(this.focusIndex, this.selectIndex);
        const maxIndex: number = Math.max(this.focusIndex, this.selectIndex) + 1;

        const textData: TextData = textFieldGetTextDataUseCase(this);
        for (let idx = minIndex; idx < maxIndex; ++idx) {
            const textObject: ITextObject = textData.textTable[idx];
            if (!textObject || textObject.mode === "wrap") {
                continue;
            }

            switch (textObject.mode) {

                case "text":
                    text += textObject.text;
                    break;

                case "break":
                    text += "\n";
                    break;

            }
        }

        this._$copyText = text;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    paste (): void
    {
        if (!this._$copyText || this.focusIndex === -1) {
            return ;
        }

        this.insertText(this._$copyText);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    arrowUp (): void
    {
        if (this.focusIndex === -1) {
            return ;
        }

        const textData: TextData = textFieldGetTextDataUseCase(this);
        if (!textData.textTable.length) {
            return ;
        }

        const index = textData.textTable.length === this.focusIndex
            ? this.focusIndex - 1
            : this.focusIndex;

        const textObject: ITextObject = textData.textTable[index];
        if (!textObject.line) {
            return ;
        }

        const line: number = textObject.mode === "text"
            ? textObject.line
            : textObject.line - 1;

        let currentWidth: number = 2;
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: ITextObject = textData.textTable[idx];
            if (this.focusIndex === idx) {
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

            const textObject: ITextObject = textData.textTable[idx];
            if (textObject.line > targetLine) {
                this.focusIndex  = textObject.mode === "text" ? idx - 1 : idx;
                this.selectIndex = -1;
                $clearTimeout(this._$timerId);
                this._$blinking();
                return ;
            }

            if (textObject.line !== targetLine || textObject.mode !== "text") {
                continue;
            }

            textWidth += textObject.w;
            if (textWidth > currentWidth) {
                this.focusIndex  = idx;
                this.selectIndex = -1;
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
        if (this.focusIndex === -1) {
            return ;
        }

        const textData: TextData = textFieldGetTextDataUseCase(this);
        if (!textData.textTable.length) {
            return ;
        }

        const textObject: ITextObject = textData.textTable[this._$focusIndex];
        const line: number = textObject.mode === "text"
            ? textObject.line
            : textObject.line - 1;

        if (line === textData.lineTable.length - 1) {
            return ;
        }

        let currentWidth: number = 2;
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: ITextObject = textData.textTable[idx];
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

            const textObject: ITextObject = textData.textTable[idx];
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

        const textData: TextData = textFieldGetTextDataUseCase(this);
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
        const textData: TextData = textFieldGetTextDataUseCase(this);
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
            minIndex = Math.min(this._$focusIndex, this._$selectIndex);
            maxIndex = Math.max(this._$focusIndex, this._$selectIndex) + 1;
            this._$focusIndex = minIndex;
        } else {
            if (2 > this._$focusIndex) {
                return ;
            }

            this._$focusIndex--;
        }

        const textData: TextData = textFieldGetTextDataUseCase(this);
        const textObject: ITextObject = textData.textTable[this._$focusIndex];
        if (textObject && textObject.mode === "wrap") {
            this._$focusIndex--;
        }

        const textFormats: TextFormat[] = $getArray();

        let newText: string = "";
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

            const textObject: ITextObject = textData.textTable[idx];

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
        this._$compositionStartIndex = this.focusIndex;
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

        let textData: TextData = textFieldGetTextDataUseCase(this);
        const textFormats: TextFormat[] = $getArray();

        const length: number = texts.length;
        let newText: string  = "";
        if (!textData.textTable.length) {
            newText = texts;
            this._$focusIndex = 1;
            this._$compositionStartIndex = 1;
        } else {
            for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

                const textObject: ITextObject = textData.textTable[idx];

                if (this._$compositionStartIndex === idx) {
                    for (let idx: number = 0; idx < length; ++idx) {
                        textFormats.push(textObject.textFormat.clone());
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
                const textObject: ITextObject = textData.textTable[this._$compositionStartIndex - 1];
                for (let idx: number = 0; idx < length; ++idx) {
                    textFormats.push(textObject.textFormat.clone());
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

        textData = textFieldGetTextDataUseCase(this);
        let index: number = this._$compositionStartIndex + length;
        for (let idx: number = this._$compositionStartIndex; idx < index; ++idx) {

            const textObject: ITextObject = textData.textTable[idx];
            if (!textObject) {
                break;
            }

            textObject.textFormat.underline = true;
            if (textObject.mode === "wrap") {
                if (idx === this._$compositionStartIndex) {
                    let subIndex = 1;
                    for (;;) {
                        const textObject: ITextObject = textData.textTable[idx - subIndex];

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

        const lastIndex = Math.min(textData.textTable.length - 1, this._$compositionEndIndex);
        const textObject: ITextObject = textData.textTable[lastIndex];
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

                const textObject: ITextObject = textData.textTable[targetIndex--];
                if (!textObject || textObject.line !== line) {
                    break;
                }

                offsetWidth += textObject.w;
            }

            const lineObject: ITextObject = textData.lineTable[line];
            const offsetAlign: number = this._$getAlignOffset(lineObject, this.width);

            const point: Point = this.localToGlobal(new Point(
                offsetWidth + offsetAlign + player.tx,
                offsetHeight + verticalAlign + player.ty
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
            const textData: TextData = textFieldGetTextDataUseCase(this);
            for (let idx: number = this._$compositionStartIndex; idx < this._$compositionEndIndex; ++idx) {
                const textObject: ITextObject = textData.textTable[idx];
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
    insertText (texts: string): void
    {
        if (this._$focusIndex === -1
            || this._$compositionStartIndex > -1
        ) {
            return ;
        }

        if (this._$selectIndex > -1) {
            this.deleteText();
        }

        const textData: TextData = textFieldGetTextDataUseCase(this);
        const textFormats: TextFormat[] = $getArray();

        let newText: string = "";
        for (let idx = 1; idx < textData.textTable.length; ++idx) {

            const textObject: ITextObject = textData.textTable[idx];

            if (this._$focusIndex === idx) {
                for (let idx = 0; idx < texts.length; ++idx) {
                    textFormats.push(textObject.textFormat);
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

        if (textData.textTable.length === this._$focusIndex) {
            let textFormat: TextFormat;
            if (textData.textTable.length) {
                const textObject: ITextObject = textData.textTable[textData.textTable.length - 1];
                textFormat = textObject.textFormat.clone();
            } else {
                textFormat = this.defaultTextFormat;
                this._$focusIndex++;
            }

            for (let idx = 0; idx < texts.length; ++idx) {
                textFormats.push(textFormat.clone());
                newText += texts[idx];
            }
        }

        // update
        this._$textFormats = textFormats;
        this.text = newText;

        // reset
        this._$textFormats = null;
        $poolArray(textFormats);

        this._$focusIndex += texts.length;
        this._$selectIndex = -1;

        $textArea.value = "";
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
        if (this.type !== "input") {
            return ;
        }

        const textData: TextData = textFieldGetTextDataUseCase(this);
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

            const textObject: ITextObject = textData.textTable[idx];

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
                                    const textObject: ITextObject = textData.textTable[index + 1];
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
     * @param  {object} text_object
     * @param  {number} width
     * @return {number}
     * @method
     * @private
     */
    _$getAlignOffset (text_object: ITextObject, width: number): number
    {
        // default
        const textData = textFieldGetTextDataUseCase(this);
        const lineWidth: number = textData.getLineWidth(text_object.line);

        const textFormat: TextFormat = text_object.textFormat;

        const leftMargin: number = textFormat.leftMargin || 0;
        if (!this._$wordWrap && lineWidth > width) {
            return Math.max(0, leftMargin);
        }

        const rightMargin: number = textFormat.rightMargin || 0;
        if (textFormat.align === "center" // format CENTER
            || this._$autoSize === "center" // autoSize CENTER
        ) {
            return Math.max(0, width / 2 - leftMargin - rightMargin - lineWidth / 2 - 2);
        }

        if (textFormat.align === "right" // format RIGHT
            || this._$autoSize === "right" // autoSize RIGHT
        ) {
            return Math.max(0, width - leftMargin - lineWidth - rightMargin - 4);
        }

        // autoSize LEFT
        // format LEFT
        return Math.max(0, leftMargin);
    }

    /**
     * @param   {Float32Array} [matrix=null]
     * @returns {object}
     * @method
     * @private
     */
    _$getBounds (matrix: Float32Array | null = null): IBounds
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
        this.type           = character.inputType;
        this._$multiline      = !!character.multiline;
        this._$wordWrap       = !!character.wordWrap;
        this._$border         = !!character.border;
        this.scrollEnabled  = !!character.scroll;
        this._$thickness      = character.thickness | 0;
        this._$thicknessColor = character.thicknessColor | 0;

        // bounds
        this.xMin        = character.originBounds.xMin;
        this.xMax        = character.originBounds.xMax;
        this.yMin        = character.originBounds.yMin;
        this.yMax        = character.originBounds.yMax;
        this.bounds.xMin = character.originBounds.xMin;
        this.bounds.xMax = character.originBounds.xMax;
        this.bounds.yMin = character.originBounds.yMin;
        this.bounds.yMax = character.originBounds.yMax;

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
        const bounds: IBounds = this._$getBounds();
        const xMax = bounds.xMax;
        const xMin = bounds.xMin;
        const yMax = bounds.yMax;
        const yMin = bounds.yMin;
        $poolBoundsObject(bounds);

        const width: number  = Math.ceil(Math.abs(xMax - xMin));
        const height: number = Math.ceil(Math.abs(yMax - yMin));
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

        const baseBounds: IBounds = this._$getBounds(null);
        baseBounds.xMin -= this._$thickness;
        baseBounds.xMax += this._$thickness;
        baseBounds.yMin -= this._$thickness;
        baseBounds.yMax += this._$thickness;

        const bounds: IBounds = $boundsMatrix(baseBounds, multiMatrix);
        const xMax   = +bounds.xMax;
        const xMin   = +bounds.xMin;
        const yMax   = +bounds.yMax;
        const yMin   = +bounds.yMin;
        $poolBoundsObject(bounds);

        const width: number  = Math.ceil(Math.abs(xMax - xMin));
        const height: number = Math.ceil(Math.abs(yMax - yMin));
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

        let xScale: number = +Math.sqrt(
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

        let yScale: number = +Math.sqrt(
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

        let filterBounds: IBounds = $getBoundsObject(0, width, 0, height);
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
            const lineWidth: number = Math.min(1, Math.max(xScale, yScale));
            const width: number  = Math.ceil(Math.abs(baseBounds.xMax - baseBounds.xMin) * xScale);
            const height: number = Math.ceil(Math.abs(baseBounds.yMax - baseBounds.yMin) * yScale);

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
                    const alpha: number = Math.max(0, Math.min(
                        rgb.A * 255 + multiColor[7], 255)
                    ) / 255;

                    ctx.fillStyle = `rgba(${rgb.R},${rgb.G},${rgb.B},${alpha})`;
                    ctx.fill();
                }

                if (this._$border) {

                    const rgb: RGBAImpl = $intToRGBA(this._$borderColor);
                    const alpha: number = Math.max(0, Math.min(
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

        const radianX: number = Math.atan2(multiMatrix[1], multiMatrix[0]);
        const radianY: number = Math.atan2(-multiMatrix[2], multiMatrix[3]);
        if (!drawFilter && (radianX || radianY)) {

            const tx: number = baseBounds.xMin * xScale;
            const ty: number = baseBounds.yMin * yScale;

            const cosX: number = Math.cos(radianX);
            const sinX: number = Math.sin(radianX);
            const cosY: number = Math.cos(radianY);
            const sinY: number = Math.sin(radianY);

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
        const textData: TextData = textFieldGetTextDataUseCase(this);
        if (!textData.textTable.length
            && this._$focusIndex > -1
            && this._$focusVisible
        ) {

            const textFormat: TextFormat = this._$defaultTextFormat;

            const rgb: RGBAImpl = $intToRGBA(textFormat.color || 0);
            const alpha: number = Math.max(0, Math.min(
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
                minIndex = Math.min(this._$focusIndex, range);
                maxIndex = Math.min(this._$selectIndex, range);
            } else {
                minIndex = Math.min(this._$selectIndex, range);
                maxIndex = Math.min(this._$focusIndex - 1, range);
            }

            const textObject: ITextObject = textData.textTable[minIndex];
            const lineObject: ITextObject = textData.lineTable[textObject.line];
            const offsetAlign: number = this._$getAlignOffset(lineObject, width);

            let x: number = 0;
            if (minIndex && textObject.mode === "text") {
                let idx: number = minIndex;
                while (idx) {
                    const textObject: ITextObject = textData.textTable[--idx];
                    if (textObject.mode !== "text") {
                        break;
                    }
                    x += textObject.w;
                }
            }

            context.fillStyle = "#b4d7ff";

            let w: number = 0;
            for (let idx: number = minIndex; idx <= maxIndex; ++idx) {

                const textObject: ITextObject = textData.textTable[idx];
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

            const textObject: ITextObject = textData.textTable[idx];
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
            const alpha: number = Math.max(0, Math.min(
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
                const alpha: number = Math.max(0, Math.min(
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
                            const alpha: number = Math.max(0, Math.min(
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
            const textObject: ITextObject = textData.textTable[this._$focusIndex - 1];
            if (textObject) {
                const rgb: RGBAImpl = $intToRGBA(textObject.textFormat.color || 0);
                const alpha: number = Math.max(0, Math.min(
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

        const baseBounds: IBounds = this._$getBounds(null);

        const bounds: IBounds = $boundsMatrix(baseBounds, multiMatrix);
        const xMax = +bounds.xMax;
        const xMin = +bounds.xMin;
        const yMax = +bounds.yMax;
        const yMin = +bounds.yMin;
        $poolBoundsObject(bounds);
        $poolBoundsObject(baseBounds);

        const width: number  = Math.ceil(Math.abs(xMax - xMin));
        const height: number = Math.ceil(Math.abs(yMax - yMin));

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
}
