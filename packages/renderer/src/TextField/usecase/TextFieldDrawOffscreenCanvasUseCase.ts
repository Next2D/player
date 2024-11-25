import type { ITextData } from "../../interface/ITextData";
import type { ITextSetting } from "../../interface/ITextSetting";
import { execute as textFiledGetAlignOffsetService } from "../service/TextFiledGetAlignOffsetService";
import { execute as textFieldGenerateFontStyleService } from "../service/TextFieldGenerateFontStyleService";
import { $intToRGBA } from "../../RendererUtil";

/**
 * @description TextDataを元にOffscreenCanvasにテキストを描画
 *              Draw text in OffscreenCanvas based on TextData
 *
 * @param  {ITextData} text_data
 * @param  {object} text_setting
 * @param  {number} x_scale
 * @param  {number} y_scale
 * @return {OffscreenCanvas}
 * @method
 * @protected
 */
export const execute = (
    text_data: ITextData,
    text_setting: ITextSetting,
    x_scale: number,
    y_scale: number
): OffscreenCanvas => {

    const canvas = new OffscreenCanvas(
        text_setting.width, text_setting.height
    );

    const context = canvas.getContext("2d");
    if (!context) {
        return canvas;
    }

    const lineWidth = Math.min(1, Math.max(x_scale, y_scale));

    // border and background
    if (text_setting.background || text_setting.border) {

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(text_setting.width, 0);
        context.lineTo(text_setting.width, text_setting.height);
        context.lineTo(0, text_setting.height);
        context.lineTo(0, 0);

        if (text_setting.background) {

            const color = $intToRGBA(text_setting.backgroundColor);

            context.fillStyle = `rgba(${color.R},${color.G},${color.B},${color.A})`;
            context.fill();
        }

        if (text_setting.border) {

            const color = $intToRGBA(text_setting.borderColor);

            context.lineWidth   = lineWidth;
            context.strokeStyle = `rgba(${color.R},${color.G},${color.B},${color.A})`;
            context.stroke();
        }

    }

    context.save();
    context.beginPath();
    context.moveTo(2, 2);
    context.lineTo(text_setting.width - 2, 2);
    context.lineTo(text_setting.width - 2, text_setting.height - 2);
    context.lineTo(2, text_setting.height - 2);
    context.lineTo(2, 2);
    context.clip();

    let tx = 2;
    if (text_setting.scrollX > 0) {
        const scaleX = (text_setting.textWidth + 4 - text_setting.rawWidth) / text_setting.rawWidth;
        tx += -text_setting.scrollX * scaleX;
    }

    let ty = 2;
    if (text_setting.scrollY > 0) {
        const scaleY = (text_setting.textHeight + 2 - text_setting.rawHeight) / text_setting.rawHeight;
        ty += -text_setting.scrollY * scaleY;
    }

    context.setTransform(x_scale, 0, 0, y_scale, tx * x_scale, ty * y_scale);
    context.beginPath();

    if (text_setting.selectIndex > -1
        && text_setting.focusIndex > -1
    ) {
        const range = text_data.textTable.length - 1;

        let minIndex = 0;
        let maxIndex = 0;
        if (text_setting.focusIndex <= text_setting.selectIndex) {
            minIndex = Math.min(text_setting.focusIndex, range);
            maxIndex = Math.min(text_setting.selectIndex, range);
        } else {
            minIndex = Math.min(text_setting.selectIndex, range);
            maxIndex = Math.min(text_setting.focusIndex - 1, range);
        }

        const textObject = text_data.textTable[minIndex];
        const lineObject = text_data.lineTable[textObject.line];
        const offsetAlign = textFiledGetAlignOffsetService(
            text_data, lineObject, text_setting
        );

        let x = 0;
        if (minIndex && textObject.mode === "text") {
            let idx = minIndex;
            while (idx) {
                const textObject = text_data.textTable[--idx];
                if (textObject.mode !== "text") {
                    break;
                }
                x += textObject.w;
            }
        }

        context.fillStyle = "#b4d7ff";

        let w = 0;
        for (let idx = minIndex; idx <= maxIndex; ++idx) {

            const textObject = text_data.textTable[idx];
            if (textObject.mode === "text") {

                w += textObject.w;

                if (idx !== maxIndex) {
                    continue;
                }
            }

            let y = 0;
            const line = textObject.mode === "text"
                ? textObject.line
                : textObject.line - 1;

            for (let idx = 0; idx < line; ++idx) {
                y += text_data.heightTable[idx];
            }

            context.beginPath();
            context.rect(
                x, y,
                w + offsetAlign,
                text_data.heightTable[line]
            );
            context.fill();

            x = 0;
            w = 0;
        }
    }

    const rawWidth = text_setting.rawWidth;
    let scrollX = 0;
    if (text_setting.scrollX > 0) {
        const scaleX = (text_setting.textWidth - rawWidth) / rawWidth;
        scrollX = text_setting.scrollX * scaleX;
    }
    const limitWidth  = rawWidth + scrollX;

    const rawHeight = text_setting.rawHeight;
    let scrollY = 0;
    if (text_setting.scrollY > 0) {
        const scaleY = (text_setting.textHeight - rawHeight) / rawHeight;
        scrollY = text_setting.scrollY * scaleY;
    }
    const limitHeight = rawHeight + scrollY;

    // setup
    let offsetWidth   = 0;
    let offsetHeight  = 0;
    let offsetAlign   = 0;
    let verticalAlign = 0;

    let skip = false;
    let currentIndex = -1;
    for (let idx = 0; idx < text_data.textTable.length; ++idx) {

        const textObject = text_data.textTable[idx];
        if (!textObject) {
            continue;
        }

        if (textObject.mode === "text" || textObject.mode === "break") {
            currentIndex++;
            if (text_setting.stopIndex > -1
                && currentIndex > text_setting.stopIndex
            ) {
                break;
            }
        }

        if (skip && textObject.mode === "text") {
            continue;
        }

        const textFormat = textObject.textFormat;

        // check
        if (text_setting.autoSize === "none") {

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
        const color = $intToRGBA(textFormat.color || 0);
        context.fillStyle = `rgba(${color.R},${color.G},${color.B},${color.A})`;

        // focus line
        if (text_setting.focusVisible
            && text_setting.focusIndex === idx
        ) {

            const x = offsetWidth + offsetAlign + 0.1;
            let line = textObject.line;

            let h = textObject.y;
            let y = text_data.ascentTable[line];
            if (textObject.mode !== "text") {

                h = textObject.mode === "break"
                    ? textObject.h
                    : text_data.ascentTable[line - 1];

                if (line > 0) {
                    line = textObject.line - 1;
                    y = text_data.ascentTable[line];
                } else {
                    y = textObject.h;
                }
            }

            if (line > 0 && text_data.ascentTable[line] === 0) {
                line++;
            }
            for (let idx = 0; idx < line; ++idx) {
                y += text_data.heightTable[idx];
            }

            context.strokeStyle = `rgba(${color.R},${color.G},${color.B},${color.A})`;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y - h);
            context.stroke();
        }

        if (text_setting.thickness) {
            const color = $intToRGBA(text_setting.thicknessColor);
            context.lineWidth   = text_setting.thickness;
            context.strokeStyle = `rgba(${color.R},${color.G},${color.B},${color.A})`;
        }

        const line = textObject.line | 0;
        switch (textObject.mode) {

            case "break":
            case "wrap":
                // reset width
                offsetWidth = 0;
                if (line) {
                    offsetHeight += text_data.heightTable[line - 1];
                }

                if (scrollY > offsetHeight + text_data.heightTable[line]) {
                    skip = true;
                    continue;
                }

                verticalAlign = text_data.ascentTable[line];
                offsetAlign   = textFiledGetAlignOffsetService(
                    text_data, textObject, text_setting
                );

                skip = false;
                break;

            case "text":
                {
                    context.beginPath();
                    context.font = textFieldGenerateFontStyleService(textFormat);

                    const x = offsetWidth  + offsetAlign;
                    const y = offsetHeight + verticalAlign;
                    if (textFormat.underline) {

                        const color = $intToRGBA(textFormat.color || 0);
                        context.lineWidth   = lineWidth;
                        context.strokeStyle = `rgba(${color.R},${color.G},${color.B},${color.A})`;

                        context.beginPath();
                        context.moveTo(x, y + 2);
                        context.lineTo(x + textObject.w, y + 2);
                        context.stroke();

                    }

                    if (text_setting.thickness) {
                        context.strokeText(textObject.text, x, y);
                    }

                    context.fillText(textObject.text, x, y);

                    offsetWidth += textObject.w;
                }
                break;

            case "image":
                break;

            default:
                break;

        }
    }

    if (text_setting.focusVisible
        && text_setting.focusIndex >= text_data.textTable.length
    ) {
        const textObject = text_data.textTable[text_setting.focusIndex - 1];
        if (textObject) {
            const color = $intToRGBA(textObject.textFormat.color || 0);
            context.strokeStyle = `rgba(${color.R},${color.G},${color.B},${color.A})`;

            const x = offsetWidth + offsetAlign + 0.1;
            const y = offsetHeight + verticalAlign;

            context.beginPath();
            if (textObject.mode === "text") {
                context.moveTo(x, y - textObject.y);
            } else {
                context.moveTo(x, y + textObject.h);
            }
            context.lineTo(x, y);
            context.stroke();
        }
    }

    context.restore();

    return canvas;
};