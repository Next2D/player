import type { IOptions } from "../../interface/IOptions";
import type { ITextObject } from "../../interface/ITextObject";
import type { TextData } from "../../TextData";
import type { TextFormat } from "../../TextFormat";
import { execute as textFormatGetWidthMarginService } from "../../TextFormat/service/TextFormatGetWidthMarginService";
import { execute as textFormatGenerateFontStyleService } from "../../TextFormat/service/TextFormatGenerateFontStyleService";
import {
    $context,
    $setCurrentWidth,
    $getCurrentWidth
} from "../../TextUtil";

/**
 * @description テキストを解析
 *              Analyze text
 * 
 * @param  {string} texts
 * @param  {TextFormat} text_format
 * @param  {TextData} text_data
 * @param  {IOptions} options
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    texts: string,
    text_format: TextFormat,
    text_data: TextData,
    options: IOptions
): void => {

    let line = text_data.lineTable.length - 1;
    const maxWidth = options.width - textFormatGetWidthMarginService(text_format) - 4;

    for (let idx = 0; idx < texts.length; ++idx) {

        const textFormat = options.textFormats
            ? options.textFormats.shift() as NonNullable<TextFormat>
            : text_format;

        const text = texts[idx];

        const object: ITextObject = {
            "mode"       : "text",
            "text"       : text,
            "x"          : 0,
            "y"          : 0,
            "w"          : 0,
            "h"          : 0,
            "line"       : line,
            "textFormat" : textFormat.toObject()
        };

        $context.font = textFormatGenerateFontStyleService(textFormat);
        const mesure  = $context.measureText(text || "");

        const width = textFormat.letterSpacing 
            ? mesure.width + textFormat.letterSpacing
            : mesure.width;

        const height = textFormat.leading 
            ? mesure.fontBoundingBoxAscent + mesure.fontBoundingBoxDescent + textFormat.leading
            : mesure.fontBoundingBoxAscent + mesure.fontBoundingBoxDescent;

        // setup
        object.x = 0;
        object.y = mesure.fontBoundingBoxAscent;
        object.w = width;
        object.h = height;

        $setCurrentWidth($getCurrentWidth() + width);
        if (options.wordWrap && $getCurrentWidth() > maxWidth) {

            $setCurrentWidth(width);

            // update
            line++;
            object.line = line;

            // break object
            const wrapObject: ITextObject = {
                "mode"       : "wrap",
                "text"       : "",
                "x"          : 0,
                "y"          : 0,
                "w"          : 0,
                "h"          : 0,
                "line"       : line,
                "textFormat" : textFormat.toObject()
            };

            let chunkLength = 1;
            let isSeparated = true;
            const pattern: RegExp = /[0-9a-zA-Z?!;:.,？！。、；：〜]/g;

            for (;;) {

                const index = text_data.textTable.length - chunkLength;
                if (0 >= index) {
                    isSeparated = false;
                    chunkLength = 0;
                    break;
                }

                const prevObj = text_data.textTable[index];
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

                const insertIdx = text_data.textTable.length - chunkLength;
                text_data.textTable.splice(insertIdx, 0, wrapObject);
                text_data.lineTable.push(wrapObject);

                const prevLine = line - 1;

                // reset
                text_data.widthTable[prevLine]  = 0;
                text_data.heightTable[prevLine] = 0;
                text_data.ascentTable[prevLine] = 0;

                for (let idx = 0; idx < insertIdx; ++idx) {
                    
                    const textObject = text_data.textTable[idx];
                    if (!textObject) {
                        continue;
                    }

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
                $setCurrentWidth(0);
                for (let idx = insertIdx + 1; idx < text_data.textTable.length; ++idx) {
                    const textObject = text_data.textTable[idx];
                    textObject.line = line;
                    $setCurrentWidth($getCurrentWidth() + textObject.w);
                }

            } else {
                text_data.textTable.push(wrapObject);
                text_data.lineTable.push(wrapObject);
            }
        }

        text_data.widthTable[line]  = $getCurrentWidth();
        text_data.heightTable[line] = Math.max(text_data.heightTable[line], height);
        text_data.ascentTable[line] = Math.max(text_data.ascentTable[line], object.y);
        text_data.textTable.push(object);
    }
};