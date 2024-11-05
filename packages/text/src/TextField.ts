import type { IBounds } from "./interface/IBounds";
import type { ITextFieldAutoSize } from "./interface/ITextFieldAutoSize";
import type { ITextFieldType } from "./interface/ITextFieldType";
import { FocusEvent } from "@next2d/events";
import { Rectangle } from "@next2d/geom";
import { TextData } from "./TextData";
import { TextFormat } from "./TextFormat";
import { execute as textFormatSetDefaultService } from "./TextFormat/service/TextFormatSetDefaultService";
import { execute as textFormatHtmlTextGenerateStyleService } from "./TextFormat/service/TextFormatHtmlTextGenerateStyleService";
import { execute as textFieldGetTextDataUseCase } from "./TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldResetUseCase } from "./TextField/usecase/TextFieldResetUseCase";
import { execute as textFieldReloadUseCase } from "./TextField/usecase/TextFieldReloadUseCase";
import { execute as textFieldUpdateStopIndexUseCase } from "./TextField/usecase/TextFieldUpdateStopIndexUseCase";
import { execute as textFieldSetFocusUseCase } from "./TextField/usecase/TextFieldSetFocusUseCase";
import { execute as textFieldSetScrollXUseCase } from "./TextField/usecase/TextFieldSetScrollXUseCase";
import { execute as textFieldSetScrollYUseCase } from "./TextField/usecase/TextFieldSetScrollYUseCase";
import { execute as textFieldHtmlTextToRawTextUseCase } from "./TextField/usecase/TextFieldHtmlTextToRawTextUseCase";
import { execute as textFieldGetLineTextUseCase } from "./TextField/usecase/TextFieldGetLineTextUseCase";
import { execute as textFieldReplaceTextUseCase } from "./TextField/usecase/TextFieldReplaceTextUseCase";
import { execute as textFieldCopyUseCase } from "./TextField/usecase/TextFieldCopyUseCase";
import { execute as textFieldInsertTextUseCase } from "./TextField/usecase/TextFieldInsertTextUseCase";
import {
    $clamp,
    $toColorInt
} from "./TextUtil";
import {
    InteractiveObject,
    Shape
} from "@next2d/display";

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
     * @member {Shape}
     * @protected
     */
    public readonly xScrollShape: Shape;

    /**
     * @description yスクロールバーの表示用の Shape オブジェクト
     *              Shape object for y scroll bar display
     * 
     * @member {Shape | null}
     * @protected
     */
    public readonly yScrollShape: Shape;

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

    /**
     * @description テキストフィールドのコンポジション開始インデックス
     *              Composition start index of the text field
     * 
     * @member {number}
     * @default -1
     * @public
     */
    public compositionStartIndex: number;

    /**
     * @description テキストフィールドのコンポジション終了インデックス
     *              Composition end index of the text field
     * 
     * @member {number}
     * @default -1
     * @public
     */
    public compositionEndIndex: number;

    /**
     * @description テキストフィールドのテキストフォーマットの配列です。
     *              An array of text formats for the text field.
     * 
     * @member {TextFormat[]}
     * @default null
     * @protected
     */
    public $textFormats: TextFormat[] | null;

    /**
     * @description x軸のスクロール位置
     *              Scroll position on the x-axis
     * 
     * @member {number}
     * @default 0
     * @protected
     */
    public $scrollX: number;

    /**
     * @description y軸のスクロール位置
     *              Scroll position on the y-axis
     * 
     * @member {number}
     * @default 0
     * @protected
     */
    public $scrollY: number;

    /**
     * @description ビルドされたキャッシュキー
     *              Built cache key
     *
     * @type {number}
     * @default 0
     * @public
     */
    public cacheKey: number;

    /**
     * @description キャッシュのビルドに利用されるパラメータ
     *              Parameters used to build the cache
     *
     * @type {number[]}
     * @public
     */
    public readonly cacheParams: number[];

    private _$background: boolean;
    private _$backgroundColor: number;
    private _$border: boolean;
    private _$borderColor: number;
    private _$htmlText: string;
    private _$multiline: boolean;
    private _$text: string;
    private _$wordWrap: boolean;
    private _$defaultTextFormat: TextFormat;
    private _$rawHtmlText: string;
    private _$autoSize: ITextFieldAutoSize;
    private _$autoFontSize: boolean;
    private _$focus: boolean;
    private _$copyText: string;
    private _$thickness: number;
    private _$thicknessColor: number;
    private _$stopIndex: number;

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
         * @protected
         */
        this.$scrollX = 0;

        /**
         * @type {number}
         * @default 0
         * @protected
         */
        this.$scrollY = 0;

        /**
         * @type {array}
         * @default null
         * @protected
         */
        this.$textFormats = null;

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
         * @public
         */
        this.compositionStartIndex = -1;

        /**
         * @type {number}
         * @default -1
         * @public
         */
        this.compositionEndIndex = -1;

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
         * @default 0
         * @public
         */
        this.cacheKey = 0;

        /**
         * @type {array}
         * @public
         */
        this.cacheParams = [0, 0, 0];
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

        textFieldUpdateStopIndexUseCase(this, index);
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
        if (multiline === this._$multiline) {
            return ;
        }
        this._$multiline = !!multiline;
        textFieldResetUseCase(this);
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
        return this.$scrollX;
    }
    set scrollX (scroll_x: number)
    {
        textFieldSetScrollXUseCase(this, scroll_x);
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
        return this.$scrollY;
    }
    set scrollY (scroll_y: number)
    {
        textFieldSetScrollYUseCase(this, scroll_y);
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

        if (!this._$rawHtmlText) {
            this._$rawHtmlText = textFieldHtmlTextToRawTextUseCase(this);
        }
        return this._$rawHtmlText;
    }
    set text (text: string)
    {
        text = `${text}`;
        if (text === this._$text) {
            return ;
        }

        // reset
        this._$htmlText    = "";
        this._$rawHtmlText = "";
        this._$isHTML      = false;

        this._$text = text;
        textFieldReloadUseCase(this);
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
        if (thickness === this._$thickness) {
            return ;
        }
        this._$thickness = thickness;
        textFieldResetUseCase(this);
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
        if (thickness_color === this._$thicknessColor) {
            return ;
        }
        this._$thicknessColor = thickness_color;
        textFieldResetUseCase(this);
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
        if (this._$wordWrap === word_wrap) {
            return ;
        }
        this._$wordWrap = !!word_wrap;
        textFieldResetUseCase(this);
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
        if (!isNaN(width) && 0 > width) {
            return ;
        }

        const xMax = width + this.bounds.xMin;
        if (xMax === this.bounds.xMax) {
            return ;
        }

        this.bounds.xMax = xMax;
        textFieldReloadUseCase(this);
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
        if (!isNaN(height) && 0 > height) {
            return ;
        }

        const yMax = height + this.bounds.yMin;
        if (yMax === this.bounds.yMax) {
            return ;
        }

        this.bounds.yMax = yMax;
        textFieldReloadUseCase(this);
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
        return this._$text || this._$htmlText 
            ? textFieldGetLineTextUseCase(this, line_index | 0)
            : "";
    }

    /**
     * @description beginIndex パラメーターと endIndex パラメーターで指定された文字範囲を、
     *              newText パラメーターの内容に置き換えます。
     *              Replaces the range of characters that the beginIndex
     *              and endIndex parameters specify with the contents of the newText parameter.
     *
     * @param  {string} new_text
     * @param  {number} begin_index
     * @param  {number} end_index
     * @return {void}
     * @method
     * @public
     */
    replaceText (
        new_text: string,
        begin_index: number,
        end_index: number
    ): void {
        textFieldReplaceTextUseCase(this, new_text, begin_index | 0, end_index | 0);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    selectAll (): void
    {
        const textData = textFieldGetTextDataUseCase(this);
        if (2 > textData.textTable.length) {
            return ;
        }

        this.selectIndex = 1;
        this.focusIndex  = textData.textTable.length;
    }

    /**
     * @description テキストフィールドの選択範囲をコピーします。
     *              Copy a selection of text fields.
     *
     * @return {void}
     * @method
     * @public
     */
    copy (): void
    {
        if (this.focusIndex === -1 || this.selectIndex === -1) {
            return ;
        }
        this._$copyText = textFieldCopyUseCase(this);
    }

    /**
     * @description コピーしたテキストを選択範囲に貼り付けます。
     *              Paste the copied text into the selected range.
     *
     * @return {void}
     * @method
     * @public
     */
    paste (): void
    {
        if (!this._$copyText || this.focusIndex === -1) {
            return ;
        }
        textFieldInsertTextUseCase(this, this._$copyText);
    }

    // /**
    //  * @param  {number} stage_x
    //  * @param  {number} stage_y
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$setIndex (stage_x: number, stage_y: number): void
    // {
    //     if (this.type !== "input") {
    //         return ;
    //     }

    //     const textData: TextData = textFieldGetTextDataUseCase(this);
    //     if (!textData.textTable.length) {
    //         this.focusIndex  = 0;
    //         this.selectIndex = -1;
    //         this.setBlinkingTimer();
    //         return ;
    //     }

    //     const width: number  = this.width;
    //     const height: number = this.height;

    //     let tx: number = 0;
    //     if (this._$scrollX > 0) {
    //         tx += this._$scrollX * (this.textWidth - width) / width;
    //     }

    //     let ty: number = 0;
    //     if (this._$scrollY) {
    //         ty += this._$scrollY * (this.textHeight - height) / height;
    //     }

    //     const eventType: string  = $getEventType();
    //     const point: Point = this.globalToLocal(new Point(stage_x, stage_y));
    //     const x: number = point.x + tx;
    //     const y: number = point.y + ty;

    //     let w: number    = 2;
    //     let yMin: number = 2;
    //     let yMax: number = yMin + textData.heightTable[0];
    //     for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

    //         const textObject: ITextObject = textData.textTable[idx];

    //         switch (textObject.mode) {

    //             case "break":
    //             case "wrap":
    //                 if (x > w && y > yMin
    //                     && yMax > y
    //                     && width > x
    //                 ) {
    //                     const index: number = idx;
    //                     switch (eventType) {

    //                         case $TOUCH_MOVE:
    //                         case $MOUSE_MOVE:
    //                             if (this._$selectIndex !== index && this._$focusIndex === index) {
    //                                 this._$selectIndex = index;

    //                                 if (this._$focusIndex !== index) {
    //                                     this._$focusVisible = false;
    //                                     $clearTimeout(this._$timerId);

    //                                     this._$doChanged();
    //                                     $doUpdated();
    //                                 }
    //                             }
    //                             break;

    //                         default:
    //                             if (this._$focusIndex !== index || this._$selectIndex > -1) {
    //                                 this._$focusIndex  = index;
    //                                 this._$selectIndex = -1;
    //                                 this.setBlinkingTimer();
    //                             }
    //                             break;
    //                     }

    //                     return ;
    //                 }

    //                 w = 2;
    //                 yMin += textData.heightTable[textObject.line - 1];
    //                 yMax = yMin + textData.heightTable[textObject.line];
    //                 break;

    //             case "text":
    //                 if (idx === textData.textTable.length - 1
    //                     && x > w && y > yMin && yMax > y
    //                     && width > x
    //                 ) {

    //                     const index: number = textData.textTable.length;
    //                     switch (eventType) {

    //                         case $TOUCH_MOVE:
    //                         case $MOUSE_MOVE:
    //                             if (this._$selectIndex !== index) {
    //                                 this._$selectIndex = index;

    //                                 if (this._$focusIndex !== index) {
    //                                     this._$focusVisible = false;
    //                                     $clearTimeout(this._$timerId);

    //                                     this._$doChanged();
    //                                     $doUpdated();
    //                                 }
    //                             }
    //                             break;

    //                         default:
    //                             if (this._$focusIndex !== index || this._$selectIndex > -1) {
    //                                 this._$focusIndex  = index;
    //                                 this._$selectIndex = -1;
    //                                 this.setBlinkingTimer();
    //                             }
    //                             break;

    //                     }

    //                     return ;
    //                 }

    //                 if (x > w && y > yMin
    //                     && yMax > y
    //                     && w + textObject.w > x
    //                 ) {

    //                     let index: number = idx;
    //                     switch (eventType) {
    //                         case $TOUCH_MOVE:
    //                         case $MOUSE_MOVE:

    //                             if (this._$focusIndex > index) { // left
    //                                 if (this._$focusIndex === index + 1) {
    //                                     if (w + textObject.w / 2 < x) {
    //                                         index = -1;
    //                                     }
    //                                 } else {
    //                                     if (w + textObject.w / 2 < x) {
    //                                         index += 1;
    //                                     }
    //                                 }
    //                             } else { // right
    //                                 if (this._$focusIndex === index) {
    //                                     if (w + textObject.w / 2 > x) {
    //                                         index = -1;
    //                                     }
    //                                 } else {
    //                                     if (w + textObject.w / 2 > x) {
    //                                         index -= 1;
    //                                     }
    //                                 }
    //                             }

    //                             if (this._$selectIndex !== index) {
    //                                 this._$selectIndex = index;

    //                                 if (this._$selectIndex > -1) {
    //                                     this._$focusVisible = false;
    //                                     $clearTimeout(this._$timerId);
    //                                 }

    //                                 this._$doChanged();
    //                                 $doUpdated();
    //                             }
    //                             break;

    //                         default:

    //                             if (w + textObject.w / 2 < x) {
    //                                 const textObject: ITextObject = textData.textTable[index + 1];
    //                                 if (!textObject || textObject.mode === "text") {
    //                                     index += 1;
    //                                 }
    //                             }

    //                             if (this._$focusIndex !== index || this._$selectIndex > -1) {
    //                                 this._$focusIndex  = index;
    //                                 this._$selectIndex = -1;
    //                                 this.setBlinkingTimer();
    //                             }
    //                             break;

    //                     }
    //                     return ;
    //                 }

    //                 w += textObject.w;
    //                 break;

    //             default:
    //                 break;

    //         }
    //     }

    //     switch (eventType) {

    //         case $TOUCH_MOVE:
    //         case $MOUSE_MOVE:
    //             // reset
    //             this._$focusIndex  = -1;
    //             this._$selectIndex = -1;
    //             break;

    //         default:
    //             this._$focusIndex  = textData.textTable.length;
    //             this._$selectIndex = -1;
    //             this.setBlinkingTimer();
    //             break;

    //     }
    // }

    // /**
    //  * @param  {object} character
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$buildCharacter (character: Character<TextCharacterImpl>): void
    // {
    //     const textFormat = this._$defaultTextFormat;

    //     textFormat.font          = character.font;
    //     textFormat.size          = character.size | 0;
    //     textFormat.align         = character.align;
    //     textFormat.color         = character.color | 0;
    //     textFormat.leading       = character.leading;
    //     textFormat.letterSpacing = character.letterSpacing;
    //     textFormat.leftMargin    = character.leftMargin;
    //     textFormat.rightMargin   = character.rightMargin;

    //     switch (character.fontType) {

    //         case 1:
    //             textFormat.bold = true;
    //             break;

    //         case 2:
    //             textFormat.italic = true;
    //             break;

    //         case 3:
    //             textFormat.bold   = true;
    //             textFormat.italic = true;
    //             break;

    //     }

    //     // setup
    //     this.type           = character.inputType;
    //     this._$multiline      = !!character.multiline;
    //     this._$wordWrap       = !!character.wordWrap;
    //     this._$border         = !!character.border;
    //     this.scrollEnabled  = !!character.scroll;
    //     this._$thickness      = character.thickness | 0;
    //     this._$thicknessColor = character.thicknessColor | 0;

    //     // bounds
    //     this.xMin        = character.originBounds.xMin;
    //     this.xMax        = character.originBounds.xMax;
    //     this.yMin        = character.originBounds.yMin;
    //     this.yMax        = character.originBounds.yMax;
    //     this.bounds.xMin = character.originBounds.xMin;
    //     this.bounds.xMax = character.originBounds.xMax;
    //     this.bounds.yMin = character.originBounds.yMin;
    //     this.bounds.yMax = character.originBounds.yMax;

    //     switch (character.autoSize) {

    //         case 1:
    //             this.autoSize = character.align;
    //             break;

    //         case 2:
    //             this.autoFontSize = true;
    //             break;

    //     }

    //     this.text = character.text;

    //     if ($rendererWorker && this._$stage) {
    //         this._$createWorkerInstance();
    //     }
    // }

    // /**
    //  * @param  {object} character
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$sync (character: TextCharacterImpl): void
    // {
    //     this._$buildCharacter(character);
    // }

    // /**
    //  * @param  {object} tag
    //  * @param  {DisplayObjectContainer} parent
    //  * @return {object}
    //  * @method
    //  * @private
    //  */
    // _$build (
    //     tag: DictionaryTagImpl,
    //     parent: ParentImpl<any>
    // ): TextCharacterImpl {

    //     const character: TextCharacterImpl = this
    //         ._$baseBuild<TextCharacterImpl>(tag, parent);

    //     this._$buildCharacter(character);

    //     return character;
    // }

    // /**
    //  * @param  {CanvasRenderingContext2D} context
    //  * @param  {Float32Array} matrix
    //  * @param  {object}  options
    //  * @return {boolean}
    //  * @method
    //  * @private
    //  */
    // _$mouseHit (
    //     context: CanvasRenderingContext2D,
    //     matrix: Float32Array,
    //     options: PlayerHitObjectImpl
    // ): boolean {

    //     if (!this._$visible) {
    //         return false;
    //     }

    //     return this._$hit(context, matrix, options);
    // }

    // /**
    //  * @param  {CanvasRenderingContext2D} context
    //  * @param  {Float32Array} matrix
    //  * @param  {object} options
    //  * @return {boolean}
    //  * @method
    //  * @private
    //  */
    // _$hit (
    //     context: CanvasRenderingContext2D,
    //     matrix: Float32Array,
    //     options: PlayerHitObjectImpl
    // ): boolean {

    //     let multiMatrix: Float32Array = matrix;
    //     const rawMatrix: Float32Array = this._$transform._$rawMatrix();
    //     if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
    //         || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
    //         || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
    //     ) {
    //         multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
    //     }

    //     const baseBounds: IBounds = this._$getBounds(null);

    //     const bounds: IBounds = $boundsMatrix(baseBounds, multiMatrix);
    //     const xMax = +bounds.xMax;
    //     const xMin = +bounds.xMin;
    //     const yMax = +bounds.yMax;
    //     const yMin = +bounds.yMin;
    //     $poolBoundsObject(bounds);
    //     $poolBoundsObject(baseBounds);

    //     const width: number  = Math.ceil(Math.abs(xMax - xMin));
    //     const height: number = Math.ceil(Math.abs(yMax - yMin));

    //     context.setTransform(1, 0, 0, 1, xMin, yMin);
    //     context.beginPath();
    //     context.moveTo(0, 0);
    //     context.lineTo(width, 0);
    //     context.lineTo(width, height);
    //     context.lineTo(0, height);
    //     context.lineTo(0, 0);

    //     if (multiMatrix !== matrix) {
    //         $poolFloat32Array6(multiMatrix);
    //     }

    //     return context.isPointInPath(options.x, options.y);
    // }
}
