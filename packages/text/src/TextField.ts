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
import { execute as textFieldReloadUseCase } from "./TextField/usecase/TextFieldReloadUseCase";
import { execute as textFieldUpdateStopIndexUseCase } from "./TextField/usecase/TextFieldUpdateStopIndexUseCase";
import { execute as textFieldSetFocusUseCase } from "./TextField/usecase/TextFieldSetFocusUseCase";
import { execute as textFieldSetScrollXUseCase } from "./TextField/usecase/TextFieldSetScrollXUseCase";
import { execute as textFieldSetScrollYUseCase } from "./TextField/usecase/TextFieldSetScrollYUseCase";
import { execute as textFieldHtmlTextToRawTextUseCase } from "./TextField/usecase/TextFieldHtmlTextToRawTextUseCase";
import { execute as textFieldGetLineTextUseCase } from "./TextField/usecase/TextFieldGetLineTextUseCase";
import { execute as textFieldReplaceTextUseCase } from "./TextField/usecase/TextFieldReplaceTextUseCase";
import { execute as textFieldCopyUseCase } from "./TextField/usecase/TextFieldCopyUseCase";
import { execute as textFieldPasteService } from "./TextField/service/TextFieldPasteService";
import { execute as textFieldInsertTextUseCase } from "./TextField/usecase/TextFieldInsertTextUseCase";
import { execute as textFieldApplyChangesService } from "./TextField/service/TextFieldApplyChangesService";
import { execute as textFieldSetFocusIndexUseCase } from "./TextField/usecase/TextFieldSetFocusIndexUseCase";
import { execute as textFieldKeyDownEventUseCase } from "./TextField/usecase/TextFieldKeyDownEventUseCase";
import { execute as textFieldDeleteTextUseCase } from "./TextField/usecase/TextFieldDeleteTextUseCase";
import { execute as textFieldSelectAllUseCase } from "./TextField/usecase/TextFieldSelectAllUseCase";
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
        textFieldApplyChangesService(this);
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
        textFieldApplyChangesService(this);
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
        textFieldApplyChangesService(this);
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
        textFieldApplyChangesService(this);
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
    set stopIndex (stop_index: number)
    {
        stop_index |= 0;
        if (this._$stopIndex === stop_index) {
            return ;
        }

        this._$stopIndex = stop_index;

        textFieldUpdateStopIndexUseCase(this, stop_index);
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
        this._$rawHtmlText = "";
        if (this._$isHTML) {
            this._$text = "";
        } else {
            this._$htmlText = "";
        }

        this._$defaultTextFormat = text_format;
        textFieldReloadUseCase(this);
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
        textFieldReloadUseCase(this);
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
        if (text !== "" && text === this._$text) {
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
        textFieldApplyChangesService(this);
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
        textFieldApplyChangesService(this);
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
        textFieldReloadUseCase(this);
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
     * @description テキストフィールドのフォーカス位置にテキスtを追加します。
     *              Adds text to the focus position of the text field.
     *
     * @param  {string} new_text
     * @return {void}
     * @method
     * @public
     */
    insertText (new_text: string): void
    {
        textFieldInsertTextUseCase(this, new_text);
    }

    /**
     * @description テキストフィールドの選択範囲を削除します。
     *              Deletes the selection range of the text field.
     *
     * @return {void}
     * @method
     * @public
     */
    deleteText (): void
    {
        textFieldDeleteTextUseCase(this);
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
        textFieldSelectAllUseCase(this);
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
        textFieldCopyUseCase(this);
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
        textFieldPasteService(this);
    }

    /**
     * @description テキストフィールドのフォーカス位置を設定します。
     *              Sets the focus position of the text field.
     *
     * @param  {number} stage_x
     * @param  {number} stage_y
     * @param  {boolean} [selected=false]
     * @return {void}
     * @method
     * @public
     */
    setFocusIndex (
        stage_x: number,
        stage_y: number,
        selected: boolean = false
    ): void {
        textFieldSetFocusIndexUseCase(this, stage_x, stage_y, selected);
    }

    /**
     * @description キーダウンイベントを処理します。
     *              Processes the key down event.
     *
     * @param {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    keyDown (event: KeyboardEvent): void
    {
        textFieldKeyDownEventUseCase(this, event);
    }
}