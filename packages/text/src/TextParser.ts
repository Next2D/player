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

        const textFormat: TextFormat = options.textFormats === null
            ? text_format
            : options.textFormats.shift() as NonNullable<TextFormat>;

        const text: string = texts[idx];

        const object: TextObjectImpl = {
            "mode"       : "text",
            "text"       : text,
            "x"          : 0,
            "y"          : 0,
            "w"          : 0,
            "h"          : 0,
            "line"       : line,
            "textFormat" : textFormat._$clone()
        };

        $context.font = textFormat._$generateFontStyle();
        const mesure: TextMetrics = $context.measureText(text || "");

        let width: number = mesure.width;
        if (textFormat.letterSpacing) {
            width += textFormat.letterSpacing;
        }

        let height: number = mesure.fontBoundingBoxAscent + mesure.fontBoundingBoxDescent;
        if (textFormat.leading) {
            height += textFormat.leading;
        }

        // setup
        object.x  = 0;
        object.y  = mesure.fontBoundingBoxAscent;
        object.w  = width;
        object.h  = height;

        $currentWidth += width;
        if (options.wordWrap && $currentWidth > maxWidth) {

            $currentWidth = width;

            // update
            line++;
            object.line = line;

            // break object
            const wrapObject: TextObjectImpl = {
                "mode"       : "wrap",
                "text"       : "",
                "x"          : 0,
                "y"          : 0,
                "w"          : 0,
                "h"          : 0,
                "line"       : line,
                "textFormat" : textFormat._$clone()
            };

            let chunkLength: number  = 1;
            let isSeparated: boolean = true;
            const pattern: RegExp    = /[0-9a-zA-Z?!;:.,？！。、；：〜]/g;

            for (;;) {

                const index: number = text_data.textTable.length - chunkLength;
                if (0 >= index) {
                    isSeparated = false;
                    chunkLength = 0;
                    break;
                }

                const prevObj: TextObjectImpl = text_data.textTable[index];
                if (!prevObj) {
                    isSeparated = false;
                    chunkLength = 0;
                    break;
                }

                if (prevObj.mode !== "text") {
                    isSeparated = false;
                    break;
                }

                if (prevObj.text === " ") {
                    chunkLength--;
                    break;
                }

                if (!prevObj.text.match(pattern)) {
                    chunkLength--;
                    break;
                }

                chunkLength++;
            }

            // new line
            text_data.widthTable[line]  = 0;
            text_data.heightTable[line] = 0;
            text_data.ascentTable[line] = 0;

            if (chunkLength > 0 && isSeparated) {

                const insertIdx: number = text_data.textTable.length - chunkLength;
                text_data.textTable.splice(insertIdx, 0, wrapObject);
                text_data.lineTable.push(wrapObject);

                const prevLine: number = line - 1;

                // reset
                text_data.widthTable[prevLine]  = 0;
                text_data.heightTable[prevLine] = 0;
                text_data.ascentTable[prevLine] = 0;

                for (let idx: number = 0; idx < insertIdx; ++idx) {
                    const textObject: TextObjectImpl = text_data.textTable[idx];
                    if (textObject.line !== prevLine) {
                        continue;
                    }

                    if (textObject.mode !== "text") {
                        continue;
                    }

                    text_data.widthTable[prevLine] += textObject.w;
                    text_data.heightTable[prevLine] = Math.max(text_data.heightTable[prevLine], textObject.h);
                    text_data.ascentTable[prevLine] = Math.max(text_data.ascentTable[prevLine], textObject.y);
                }

                // reset
                $currentWidth = 0;
                for (let idx: number = insertIdx + 1; idx < text_data.textTable.length; ++idx) {
                    const textObject: TextObjectImpl = text_data.textTable[idx];
                    textObject.line = line;
                    $currentWidth += textObject.w;
                }

            } else {
                text_data.textTable.push(wrapObject);
                text_data.lineTable.push(wrapObject);
            }
        }

        text_data.widthTable[line]  = $currentWidth;
        text_data.heightTable[line] = Math.max(text_data.heightTable[line], height);
        text_data.ascentTable[line] = Math.max(text_data.ascentTable[line], object.y);
        text_data.textTable.push(object);
    }
};

/**
 * @param  {string} value
 * @param  {TextFormat} text_format
 * @return {void}
 * @method
 * @private
 */
const _$parseStyle = (
    value: string,
    text_format: TextFormat,
    options: OptionsImpl
): void => {

    const values: string[] = value
        .trim()
        .split(";");

    const attributes: any[] = [];
    for (let idx: number = 0; idx < values.length; ++idx) {

        const styleValue: string = values[idx];
        if (!styleValue) {
            continue;
        }

        const styles: any[] = styleValue.split(":");
        const name: string  = styles[0].trim();
        const value: string = styles[1].trim();
        switch (name) {

            case "font-size":
                attributes.push({
                    "name": "size",
                    "value": parseFloat(value)
                });
                break;

            case "font-family":
                attributes.push({
                    "name": "face",
                    "value": value.replace(/'|"/g, "")
                });
                break;

            case "letter-spacing":
                attributes.push({
                    "name": "letterSpacing",
                    "value": value
                });
                break;

            case "margin-bottom":
                attributes.push({
                    "name": "leading",
                    "value": parseFloat(value)
                });
                break;

            case "margin-left":
                attributes.push({
                    "name": "leftMargin",
                    "value": parseFloat(value)
                });
                break;

            case "margin-right":
                attributes.push({
                    "name": "rightMargin",
                    "value": parseFloat(value)
                });
                break;

            case "color":
            case "align":
                attributes.push({
                    "name": name,
                    "value": value
                });
                break;

            case "text-decoration":
            case "font-weight":
            case "font-style":
                attributes.push({
                    "name": value,
                    "value": true
                });
                break;

            default:
                break;

        }
    }

    // eslint-disable-next-line no-use-before-define
    _$setAttributes(attributes, text_format, options);
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

            case "style":
                _$parseStyle(object.value, text_format, options);
                break;

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

            case "underline":
                text_format.underline = true;
                break;

            case "bold":
                text_format.bold = true;
                break;

            case "italic":
                text_format.italic = true;
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

    const textData: TextData = new TextData();
    if (!text) {
        return textData;
    }

    const lineText: string[] = options.multiline
        ? text.split("\n")
        : [text.replace("\n", "")];

    for (let idx: number = 0; idx < lineText.length; ++idx) {

        let textFormat: TextFormat = text_format._$clone();
        if (options.textFormats) {
            textFormat = idx === 0
                ? options.textFormats[0]
                : options.textFormats.shift() as NonNullable<TextFormat>;
        }

        if (options.subFontSize
            && options.subFontSize > 0 && textFormat.size
        ) {
            textFormat.size -= options.subFontSize;
            if (1 > textFormat.size) {
                textFormat.size = 1;
            }
        }

        if (idx === 0 || options.wordWrap || options.multiline) {
            _$createNewLine(textData, textFormat);
        }

        const texts: string = lineText[idx];
        if (texts) {
            $currentWidth = 0;
            _$parseText(texts, textFormat, textData, options);
        }
    }

    _$adjustmentHeight(textData);

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

    const textData: TextData = new TextData();
    if (!html_text) {
        return textData;
    }

    const htmlText: string = html_text
        .trim()
        .replace(/\r?\n/g, "")
        .replace(/\t/g, "");

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

    return textData;
};