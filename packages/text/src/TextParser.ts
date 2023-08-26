import { parseDocument } from "htmlparser2";
import { TextData } from "./TextData";
import { TextFormat } from "./TextFormat";
import { $toColorInt } from "@next2d/share";
import type { OptionsImpl } from "./interface/OptionsImpl";
import type { TextObjectImpl } from "./interface/TextObjectImpl";

/**
 * @type {OffscreenCanvasRenderingContext2D}
 * @private
 */
const $context: OffscreenCanvasRenderingContext2D = new OffscreenCanvas(1, 1).getContext("2d") as NonNullable<OffscreenCanvasRenderingContext2D>;

/**
 * @type {number}
 * @private
 */
let $currentWidth: number = 0;

/**
 * @param  {string} texts
 * @param  {TextFormat} text_format
 * @param  {TextData} text_data
 * @param  {object} options
 * @return {void}
 * @method
 * @private
 */
const _$parseText = (
    texts: string,
    text_format: TextFormat,
    text_data: TextData,
    options: OptionsImpl
): void => {

    let line: number = text_data.lineTable.length - 1;
    const maxWidth: number = options.width - text_format._$widthMargin() - 4;

    for (let idx: number = 0; idx < texts.length; ++idx) {

        const text: string = texts[idx];

        const object: TextObjectImpl = {
            "mode"       : "text",
            "text"       : text,
            "x"          : 0,
            "y"          : 0,
            "w"          : 0,
            "h"          : 0,
            "line"       : line,
            "textFormat" : text_format._$clone()
        };

        const breakCode: boolean = options.multiline
            && text === "\n"
            || text === "\r"
            || text === "\n\r";

        $context.font = text_format._$generateFontStyle();
        const mesure: TextMetrics = $context.measureText(text || "");

        let width: number = mesure.width;
        if (text_format.letterSpacing) {
            width += text_format.letterSpacing;
        }

        let height: number = mesure.fontBoundingBoxAscent + mesure.fontBoundingBoxDescent;
        if (line && text_format.leading) {
            height += text_format.leading;
        }

        // setup
        object.x = mesure.actualBoundingBoxLeft;
        object.y = mesure.actualBoundingBoxAscent;
        object.w = width;
        object.h = height;

        $currentWidth += width;
        if (breakCode || options.wordWrap && $currentWidth > maxWidth) {

            $currentWidth = width;

            // update
            line++;
            object.line = line;

            // break object
            const wrapObject: TextObjectImpl = {
                "mode"       : breakCode ? "break" : "wrap",
                "text"       : "",
                "x"          : 0,
                "y"          : 0,
                "w"          : 0,
                "h"          : 0,
                "line"       : line,
                "textFormat" : text_format._$clone()
            };

            // new line
            text_data.widthTable[line]  = 0;
            text_data.heightTable[line] = 0;
            text_data.ascentTable[line] = 0;

            text_data.textTable.push(wrapObject);
            text_data.lineTable.push(wrapObject);
        }

        if (!breakCode) {
            text_data.widthTable[line]  = $currentWidth;
            text_data.heightTable[line] = Math.max(text_data.heightTable[line], height);
            text_data.ascentTable[line] = Math.max(text_data.ascentTable[line], object.y);
            text_data.textTable.push(object);
        }
    }
};

/**
 * @param  {array} attributes
 * @param  {TextFormat} text_format
 * @param  {object} options
 * @return {void}
 * @method
 * @private
 */
const _$setAttributes = (
    attributes: any[],
    text_format: TextFormat,
    options: OptionsImpl
): void => {

    for (let idx = 0; idx < attributes.length; ++idx) {
        const object: any = attributes[idx];
        switch (object.name) {

            case "align":
                text_format.align = object.value;
                break;

            case "face":
                text_format.font = object.value;
                break;

            case "size":
                text_format.size = +object.value;
                if (options.subFontSize) {
                    text_format.size -= options.subFontSize;
                    if (1 > text_format.size) {
                        text_format.size = 1;
                    }
                }
                break;

            case "color":
                text_format.color = $toColorInt(object.value);
                break;

            case "letterSpacing":
                text_format.letterSpacing = +object.value;
                break;

            case "leading":
                text_format.leading = +object.value;
                break;

            case "leftMargin":
                text_format.leftMargin = +object.value;
                break;

            case "rightMargin":
                text_format.rightMargin = +object.value;
                break;

            default:
                break;

        }
    }
};

/**
 * @param {TextData} text_data
 * @param {TextFormat} text_format
 * @return {void}
 * @method
 * @private
 */
const _$createNewLine = (
    text_data: TextData,
    text_format: TextFormat
): void => {

    $currentWidth = 0;
    const line: number = text_data.lineTable.length;

    $context.font = text_format._$generateFontStyle();
    const mesure: TextMetrics = $context.measureText("");

    const object: TextObjectImpl = {
        "mode": "break",
        "text": "",
        "x": 0,
        "y": 0,
        "w": 0,
        "h": mesure.fontBoundingBoxAscent + mesure.fontBoundingBoxDescent,
        "line": line,
        "textFormat": text_format._$clone()
    };

    text_data.heightTable[line] = 0;
    text_data.ascentTable[line] = 0;
    text_data.widthTable[line]  = 0;

    // register
    text_data.lineTable.push(object);
    text_data.textTable.push(object);
};

/**
 * @param  {object} document
 * @param  {TextFormat} text_format
 * @param  {TextData} text_data
 * @param  {object} options
 * @return {void}
 * @method
 * @private
 */
const _$parseTag = (
    document: any,
    text_format: TextFormat,
    text_data: TextData,
    options: OptionsImpl
): void => {

    for (let idx: number = 0; idx < document.children.length; ++idx) {

        const node: any = document.children[idx];
        if (node.nodeType === 3) {

            _$parseText(node.nodeValue || "", text_format, text_data, options);

            continue;

        }

        const tf = text_format._$clone();
        switch (node.name.toUpperCase()) {

            case "DIV": // div tag
            case "P": // p tag
                _$setAttributes(node.attributes, tf, options);

                if (options.multiline) {
                    _$createNewLine(text_data, tf);
                }

                _$parseTag(node, tf, text_data, options);

                if (options.multiline) {
                    _$createNewLine(text_data, tf);
                }

                continue;

            case "U": // underline
                tf.underline = true;
                break;

            case "B": // bold
                tf.bold = true;
                break;

            case "I": // italic
                tf.italic = true;
                break;

            case "FONT": // FONT tag
            case "SPAN": // SPAN tag
                _$setAttributes(node.attributes, tf, options);
                break;

            case "BR":
                if (!options.multiline) {
                    continue;
                }
                _$createNewLine(text_data, tf);
                break;

            default:
                break;

        }

        _$parseTag(node, tf, text_data, options);
    }
};

/**
 * @param  {TextData} text_data
 * @return {void}
 * @method
 * @private
 */
const _$adjustmentHeight = (text_data: TextData): void =>
{
    const length: number = text_data.heightTable.length - 1;
    for (let idx: number = 1; idx < length; ++idx) {

        const height: number = text_data.heightTable[idx];
        if (height > 0) {
            continue;
        }

        // 改行があって、高さの設定がなければ前の行の高さを設定する
        const object: TextObjectImpl = text_data.lineTable[idx];
        text_data.heightTable[idx] = object.h = text_data.heightTable[idx - 1];
    }
};

/**
 * @description 文字列のテキストを分解・解析して配列戻す
 *
 * @param  {string} text
 * @param  {object} [options = null]
 * @return {TextData}
 * @method
 * @public
 */
export const parsePlainText = (
    text: string,
    text_format: TextFormat,
    options: OptionsImpl
): TextData => {

    const lineText: string[] = options.multiline
        ? text.split("\n")
        : [text.replace("\n", "")];

    const textData: TextData = new TextData();

    // clone
    const textFormat: TextFormat = text_format._$clone();
    if (options.subFontSize
        && options.subFontSize > 0 && textFormat.size
    ) {
        textFormat.size -= options.subFontSize;
        if (1 > textFormat.size) {
            textFormat.size = 1;
        }
    }

    _$createNewLine(textData, textFormat);
    for (let idx: number = 0; idx < lineText.length; ++idx) {

        if (options.wordWrap || options.multiline) {
            _$createNewLine(textData, textFormat);
        }

        const texts: string = lineText[idx];
        if (texts) {
            $currentWidth = 0;
            _$parseText(texts, textFormat, textData, options);
        }
    }

    _$adjustmentHeight(textData);

    console.log(textData);
    return textData;
};

/**
 * @description HTMLを分解・解析して配列戻す
 *
 * @param  {string} html_text
 * @param  {object} [options = null]
 * @return {array}
 * @method
 * @public
 */
export const parseHtmlText = (
    html_text: string,
    text_format: TextFormat,
    options: OptionsImpl
): TextData => {

    const htmlText: string = html_text
        .trim()
        .replace(/\r?\n/g, "")
        .replace(/\t/g, "");

    const textData: TextData = new TextData();

    const textFormat: TextFormat = text_format._$clone();
    if (options.subFontSize && options.subFontSize > 0 && textFormat.size) {
        textFormat.size -= options.subFontSize;
        if (1 > textFormat.size) {
            textFormat.size = 1;
        }
    }

    const document: any = parseDocument(htmlText);
    _$createNewLine(textData, textFormat);

    _$parseTag(document, textFormat, textData, options);

    _$adjustmentHeight(textData);

    console.log(textData);
    return textData;
};