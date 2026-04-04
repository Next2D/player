import type { TextFormat } from "../../TextFormat";
import type { TextData } from "../../TextData";
import type { IOptions } from "../../interface/IOptions";
import type { IAttributeObject } from "../../interface/IAttributeObject";
import type { ITextFormatAlign } from "../../interface/ITextFormatAlign";
import { execute as textParserParseTextUseCase } from "./TextParserParseTextUseCase";
import { execute as textParserCreateNewLineUseCase } from "./TextParserCreateNewLineUseCase";
import { execute as textParserParseStyleService } from "../service/TextParserParseStyleService";
import { $toColorInt } from "../../TextUtil";

/**
 * @description 数値タグID — 文字列生成を完全排除
 *              Numeric tag IDs — eliminates all tag string allocation
 */
const $TAG_NONE: number = 0;
const $TAG_B: number    = 1;
const $TAG_I: number    = 2;
const $TAG_U: number    = 3;
const $TAG_P: number    = 4;
const $TAG_BR: number   = 5;
const $TAG_DIV: number  = 6;
const $TAG_FONT: number = 7;
const $TAG_SPAN: number = 8;

/**
 * @description モジュールレベルのパーサ状態
 *              Module-level parser state
 */
let _$html: string = "";
let _$pos: number = 0;
let _$len: number = 0;

/**
 * @description HTMLタグを直接解析してTextDataを構築
 *              中間ツリーなし、タグ名文字列なし、clone()なし、属性オブジェクトなし
 *              Parse HTML directly — no tree, no tag strings, no clone, no attr objects
 *
 * @param  {string} html
 * @param  {TextFormat} text_format
 * @param  {TextData} text_data
 * @param  {IOptions} options
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    html: string,
    text_format: TextFormat,
    text_data: TextData,
    options: IOptions
): void => {

    _$html = html;
    _$pos  = 0;
    _$len  = html.length;

    $processChildren($TAG_NONE, text_format, text_data, options);

    _$html = "";
};

/**
 * @description 子要素をストリーミング解析・処理（再帰）
 *              save/restoreでTextFormatをスタック管理 — clone()ゼロ
 *              Stream-parse children with stack-based format — zero clone()
 */
const $processChildren = (
    parent_tag_id: number,
    text_format: TextFormat,
    text_data: TextData,
    options: IOptions
): void => {

    while (_$pos < _$len) {

        const ltIdx: number = _$html.indexOf("<", _$pos);

        if (ltIdx === -1) {
            textParserParseTextUseCase(
                _$html.substring(_$pos), text_format, text_data, options
            );
            _$pos = _$len;
            break;
        }

        if (ltIdx > _$pos) {
            textParserParseTextUseCase(
                _$html.substring(_$pos, ltIdx), text_format, text_data, options
            );
        }

        _$pos = ltIdx + 1;
        if (_$pos >= _$len) {
            break;
        }

        // closing tag: '</'
        if (_$html.charCodeAt(_$pos) === 0x2F) {
            _$pos++;
            const gtIdx: number = _$html.indexOf(">", _$pos);
            if (gtIdx === -1) {
                _$pos = _$len;
                break;
            }
            if (parent_tag_id !== $TAG_NONE && $identifyTag(_$pos, gtIdx) === parent_tag_id) {
                _$pos = gtIdx + 1;
                return;
            }
            _$pos = gtIdx + 1;
            continue;
        }

        const tagStart: number = _$pos;
        while (_$pos < _$len) {
            const c: number = _$html.charCodeAt(_$pos);
            if (c === 0x3E || c === 0x2F || c === 0x20 || c === 0x09) {
                break;
            }
            _$pos++;
        }
        const tagId: number = $identifyTag(tagStart, _$pos);

        switch (tagId) {

            case $TAG_B: {
                const saved: boolean | null = text_format.bold;
                text_format.bold = true;
                $skipToClose();
                $processChildren(tagId, text_format, text_data, options);
                text_format.bold = saved;
                continue;
            }

            case $TAG_I: {
                const saved: boolean | null = text_format.italic;
                text_format.italic = true;
                $skipToClose();
                $processChildren(tagId, text_format, text_data, options);
                text_format.italic = saved;
                continue;
            }

            case $TAG_U: {
                const saved: boolean | null = text_format.underline;
                text_format.underline = true;
                $skipToClose();
                $processChildren(tagId, text_format, text_data, options);
                text_format.underline = saved;
                continue;
            }

            case $TAG_DIV:
            case $TAG_P:
            case $TAG_FONT:
            case $TAG_SPAN: {
                const sFont: string | null = text_format.font;
                const sSize: number | null = text_format.size;
                const sColor: number | null = text_format.color;
                const sBold: boolean | null = text_format.bold;
                const sItalic: boolean | null = text_format.italic;
                const sUnderline: boolean | null = text_format.underline;
                const sAlign: ITextFormatAlign | null = text_format.align;
                const sLeftMargin: number | null = text_format.leftMargin;
                const sRightMargin: number | null = text_format.rightMargin;
                const sLeading: number | null = text_format.leading;
                const sLetterSpacing: number | null = text_format.letterSpacing;

                $applyAttributesInline(text_format, options);
                $finishOpenTag();

                if ((tagId === $TAG_P || tagId === $TAG_DIV) && options.multiline) {
                    textParserCreateNewLineUseCase(text_data, text_format);
                }

                $processChildren(tagId, text_format, text_data, options);

                text_format.font = sFont;
                text_format.size = sSize;
                text_format.color = sColor;
                text_format.bold = sBold;
                text_format.italic = sItalic;
                text_format.underline = sUnderline;
                text_format.align = sAlign;
                text_format.leftMargin = sLeftMargin;
                text_format.rightMargin = sRightMargin;
                text_format.leading = sLeading;
                text_format.letterSpacing = sLetterSpacing;
                continue;
            }

            case $TAG_BR:
                $skipToClose();
                if (options.multiline) {
                    textParserCreateNewLineUseCase(text_data, text_format);
                }
                continue;

            default:
                $skipToClose();
                continue;

        }
    }
};

/**
 * @description '>' までスキップ（V8 SIMD最適化のindexOf使用）
 *              Skip to '>' using SIMD-optimized indexOf
 */
const $skipToClose = (): void =>
{
    const idx: number = _$html.indexOf(">", _$pos);
    _$pos = idx === -1 ? _$len : idx + 1;
};

/**
 * @description 属性パース後のタグ末尾処理
 *              Handle end of opening tag after attribute parsing
 */
const $finishOpenTag = (): void =>
{
    if (_$pos < _$len && _$html.charCodeAt(_$pos) === 0x2F) {
        _$pos++;
    }
    if (_$pos < _$len && _$html.charCodeAt(_$pos) === 0x3E) {
        _$pos++;
    }
};

/**
 * @description 属性をインラインで解析・直接適用
 *              IAttributeObject配列・オブジェクト・属性名文字列を一切生成しない
 *              Parse and apply attributes inline — zero arrays, objects, name strings
 */
const $applyAttributesInline = (
    text_format: TextFormat,
    options: IOptions
): void => {

    for (;;) {

        while (_$pos < _$len) {
            const c: number = _$html.charCodeAt(_$pos);
            if (c !== 0x20 && c !== 0x09) {
                break;
            }
            _$pos++;
        }

        if (_$pos >= _$len) {
            break;
        }

        const ch: number = _$html.charCodeAt(_$pos);
        if (ch === 0x3E || ch === 0x2F) {
            break;
        }

        const nameStart: number = _$pos;
        while (_$pos < _$len) {
            const c: number = _$html.charCodeAt(_$pos);
            if (c === 0x3D || c === 0x3E || c === 0x2F || c === 0x20 || c === 0x09) {
                break;
            }
            _$pos++;
        }

        if (_$pos === nameStart) {
            break;
        }

        const name_len: number = _$pos - nameStart;
        const name_c0: number = _$html.charCodeAt(nameStart);

        while (_$pos < _$len) {
            const c: number = _$html.charCodeAt(_$pos);
            if (c !== 0x20 && c !== 0x09) {
                break;
            }
            _$pos++;
        }

        if (_$pos < _$len && _$html.charCodeAt(_$pos) === 0x3D) {
            _$pos++;

            while (_$pos < _$len) {
                const c: number = _$html.charCodeAt(_$pos);
                if (c !== 0x20 && c !== 0x09) {
                    break;
                }
                _$pos++;
            }

            let value: string;
            const quote: number = _$html.charCodeAt(_$pos);

            if (quote === 0x22 || quote === 0x27) {
                _$pos++;
                const closeIdx: number = _$html.indexOf(
                    quote === 0x22 ? "\"" : "'", _$pos
                );
                if (closeIdx === -1) {
                    value = _$html.substring(_$pos);
                    _$pos = _$len;
                } else {
                    value = _$html.substring(_$pos, closeIdx);
                    _$pos = closeIdx + 1;
                }
            } else {
                const valStart: number = _$pos;
                while (_$pos < _$len) {
                    const c: number = _$html.charCodeAt(_$pos);
                    if (c === 0x3E || c === 0x2F || c === 0x20 || c === 0x09) {
                        break;
                    }
                    _$pos++;
                }
                value = _$html.substring(valStart, _$pos);
            }

            $applyAttribute(name_len, name_c0, value, text_format, options);
        } else {
            $applyBooleanAttribute(name_len, name_c0, text_format);
        }
    }
};

/**
 * @description 属性名をcharCodeで識別して値を直接適用
 *              Identify attribute name by charCode and apply value directly
 *
 * name lengths: face(4), size(4), bold(4), style(5), align(5), color(5),
 *               italic(6), leading(7), underline(9), leftMargin(10),
 *               rightMargin(11), letterSpacing(14)
 */
const $applyAttribute = (
    name_len: number,
    name_c0: number,
    value: string,
    text_format: TextFormat,
    options: IOptions
): void => {

    switch (name_len) {

        case 4:
            // face(0x66/0x46) | size(0x73/0x53) | bold(0x62/0x42)
            if (name_c0 === 0x66 || name_c0 === 0x46) {
                text_format.font = value;
            } else if (name_c0 === 0x73 || name_c0 === 0x53) {
                text_format.size = +value;
                if (options.subFontSize) {
                    text_format.size -= options.subFontSize;
                    if (1 > text_format.size) {
                        text_format.size = 1;
                    }
                }
            } else if (name_c0 === 0x62 || name_c0 === 0x42) {
                text_format.bold = true;
            }
            break;

        case 5:
            // color(0x63/0x43) | style(0x73/0x53) | align(0x61/0x41)
            if (name_c0 === 0x63 || name_c0 === 0x43) {
                text_format.color = $toColorInt(value);
            } else if (name_c0 === 0x73 || name_c0 === 0x53) {
                $applyStyleAttributes(
                    textParserParseStyleService(value),
                    text_format, options
                );
            } else if (name_c0 === 0x61 || name_c0 === 0x41) {
                text_format.align = value as ITextFormatAlign;
            }
            break;

        case 6:
            // italic(0x69/0x49)
            if (name_c0 === 0x69 || name_c0 === 0x49) {
                text_format.italic = true;
            }
            break;

        case 7:
            // leading(0x6C/0x4C)
            if (name_c0 === 0x6C || name_c0 === 0x4C) {
                text_format.leading = parseInt(value);
            }
            break;

        case 9:
            // underline(0x75/0x55)
            if (name_c0 === 0x75 || name_c0 === 0x55) {
                text_format.underline = true;
            }
            break;

        case 10:
            // leftMargin(0x6C/0x4C)
            if (name_c0 === 0x6C || name_c0 === 0x4C) {
                text_format.leftMargin = parseInt(value);
            }
            break;

        case 11:
            // rightMargin(0x72/0x52)
            if (name_c0 === 0x72 || name_c0 === 0x52) {
                text_format.rightMargin = parseInt(value);
            }
            break;

        case 14:
            // letterSpacing(0x6C/0x4C)
            if (name_c0 === 0x6C || name_c0 === 0x4C) {
                text_format.letterSpacing = parseInt(value);
            }
            break;

        default:
            break;

    }
};

/**
 * @description 値なし属性をcharCodeで識別して直接適用
 *              Apply boolean (no-value) attributes by charCode
 */
const $applyBooleanAttribute = (
    name_len: number,
    name_c0: number,
    text_format: TextFormat
): void => {
    if (name_len === 4 && (name_c0 === 0x62 || name_c0 === 0x42)) {
        text_format.bold = true;
    } else if (name_len === 6 && (name_c0 === 0x69 || name_c0 === 0x49)) {
        text_format.italic = true;
    } else if (name_len === 9 && (name_c0 === 0x75 || name_c0 === 0x55)) {
        text_format.underline = true;
    }
};

/**
 * @description style属性の解析結果をtext_formatに直接適用
 *              Apply parsed style attributes directly to text_format
 */
const $applyStyleAttributes = (
    attributes: IAttributeObject[],
    text_format: TextFormat,
    options: IOptions
): void => {
    for (let idx: number = 0; idx < attributes.length; ++idx) {
        const attr: IAttributeObject = attributes[idx];
        switch (attr.name) {

            case "face":
                text_format.font = attr.value as string;
                break;

            case "size":
                text_format.size = +attr.value;
                if (options.subFontSize) {
                    text_format.size -= options.subFontSize;
                    if (1 > text_format.size) {
                        text_format.size = 1;
                    }
                }
                break;

            case "color":
                text_format.color = $toColorInt(attr.value);
                break;

            case "align":
                text_format.align = attr.value as ITextFormatAlign;
                break;

            case "letterSpacing":
                text_format.letterSpacing = parseInt(attr.value as string);
                break;

            case "leading":
                text_format.leading = parseInt(attr.value as string);
                break;

            case "leftMargin":
                text_format.leftMargin = parseInt(attr.value as string);
                break;

            case "rightMargin":
                text_format.rightMargin = parseInt(attr.value as string);
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
 * @description 文字列未生成でタグを数値IDに変換
 *              Zero-allocation tag identification via character comparison
 */
const $identifyTag = (start: number, end: number): number =>
{
    while (start < end) {
        const c: number = _$html.charCodeAt(start);
        if (c !== 0x20 && c !== 0x09) {
            break;
        }
        start++;
    }
    while (end > start) {
        const c: number = _$html.charCodeAt(end - 1);
        if (c !== 0x20 && c !== 0x09) {
            break;
        }
        end--;
    }

    const length: number = end - start;

    if (length === 1) {
        let c: number = _$html.charCodeAt(start);
        if (c >= 0x61) { c -= 0x20 }
        if (c === 0x42) { return $TAG_B }  // B
        if (c === 0x49) { return $TAG_I }  // I
        if (c === 0x55) { return $TAG_U }  // U
        if (c === 0x50) { return $TAG_P }  // P
        return $TAG_NONE;
    }

    if (length === 2) {
        let c0: number = _$html.charCodeAt(start);
        let c1: number = _$html.charCodeAt(start + 1);
        if (c0 >= 0x61) { c0 -= 0x20 }
        if (c1 >= 0x61) { c1 -= 0x20 }
        if (c0 === 0x42 && c1 === 0x52) { return $TAG_BR } // BR
        return $TAG_NONE;
    }

    if (length === 3) {
        let c0: number = _$html.charCodeAt(start);
        if (c0 >= 0x61) { c0 -= 0x20 }
        if (c0 === 0x44) { // D
            let c1: number = _$html.charCodeAt(start + 1);
            let c2: number = _$html.charCodeAt(start + 2);
            if (c1 >= 0x61) { c1 -= 0x20 }
            if (c2 >= 0x61) { c2 -= 0x20 }
            if (c1 === 0x49 && c2 === 0x56) { return $TAG_DIV } // DIV
        }
        return $TAG_NONE;
    }

    if (length === 4) {
        let c0: number = _$html.charCodeAt(start);
        if (c0 >= 0x61) { c0 -= 0x20 }
        if (c0 === 0x46) { // F
            let c1: number = _$html.charCodeAt(start + 1);
            let c2: number = _$html.charCodeAt(start + 2);
            let c3: number = _$html.charCodeAt(start + 3);
            if (c1 >= 0x61) { c1 -= 0x20 }
            if (c2 >= 0x61) { c2 -= 0x20 }
            if (c3 >= 0x61) { c3 -= 0x20 }
            if (c1 === 0x4F && c2 === 0x4E && c3 === 0x54) { return $TAG_FONT } // FONT
        }
        if (c0 === 0x53) { // S
            let c1: number = _$html.charCodeAt(start + 1);
            let c2: number = _$html.charCodeAt(start + 2);
            let c3: number = _$html.charCodeAt(start + 3);
            if (c1 >= 0x61) { c1 -= 0x20 }
            if (c2 >= 0x61) { c2 -= 0x20 }
            if (c3 >= 0x61) { c3 -= 0x20 }
            if (c1 === 0x50 && c2 === 0x41 && c3 === 0x4E) { return $TAG_SPAN } // SPAN
        }
        return $TAG_NONE;
    }

    return $TAG_NONE;
};