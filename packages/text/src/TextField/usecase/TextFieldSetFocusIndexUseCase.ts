import type { TextField } from "../../TextField";
import { Point } from "@next2d/geom";
import { execute as textFieldGetTextDataUseCase } from "./TextFieldGetTextDataUseCase";
import { execute as textFieldBlinkingUseCase } from "./TextFieldBlinkingUseCase";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";
import { execute as textFieldBlinkingClearTimeoutService } from "../service/TextFieldBlinkingClearTimeoutService";
import { $getBlinkingTimerId } from "../../TextUtil";

/**
 * @description テキストフィールドのフォーカスしてるテキスト位置（インデックス）を設定します。
 *              Set the text position (index) that the text field is focusing on.
 *
 * @param  {TextField} text_field
 * @param  {number} stage_x
 * @param  {number} stage_y
 * @param  {boolean} [selected=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    text_field: TextField,
    stage_x: number,
    stage_y: number,
    selected: boolean = false
): void => {

    if (text_field.type !== "input") {
        return ;
    }

    const textData = textFieldGetTextDataUseCase(text_field);
    if (2 > textData.textTable.length) {
        text_field.focusIndex  = 1;
        text_field.selectIndex = -1;

        if ($getBlinkingTimerId() === undefined) {
            textFieldBlinkingUseCase(text_field);
        }

        return ;
    }

    const width  = text_field.width;
    const height = text_field.height;

    let tx = 0;
    if (text_field.scrollX > 0) {
        tx += text_field.scrollX * (text_field.textWidth - width) / width;
    }

    let ty = 0;
    if (text_field.scrollY > 0) {
        ty += text_field.scrollY * (text_field.textHeight - height) / height;
    }

    const point = text_field.globalToLocal(new Point(stage_x, stage_y));
    const x = point.x + tx;
    const y = point.y + ty;

    let w    = 2;
    let yMin = 2;
    let yMax = yMin + textData.heightTable[0];
    for (let idx = 1; idx < textData.textTable.length; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        switch (textObject.mode) {

            case "break":
            case "wrap":
                if (x > w && y > yMin
                    && yMax > y
                    && width > x
                ) {
                    const index = idx;
                    if (selected) {
                        if (text_field.selectIndex !== index
                            && text_field.focusIndex === index
                        ) {
                            text_field.selectIndex = index;

                            if (text_field.focusIndex !== index) {
                                text_field.focusVisible = false;
                                textFieldBlinkingClearTimeoutService();
                                textFieldApplyChangesService(text_field);
                            }
                        }
                    } else {
                        if (text_field.focusIndex !== index || text_field.selectIndex > -1) {
                            text_field.focusIndex  = index;
                            text_field.selectIndex = -1;
                            textFieldApplyChangesService(text_field);
                        }
                    }

                    return ;
                }

                w = 2;
                yMin += textData.heightTable[textObject.line - 1];
                yMax = yMin + textData.heightTable[textObject.line];
                break;

            case "text":
                if (x > w && y > yMin
                    && yMax > y
                    && w + textObject.w > x
                ) {
                    let index = idx;
                    if (selected) {
                        if (text_field.focusIndex > index) {
                            // left
                            if (text_field.focusIndex === index + 1) {
                                if (w + textObject.w / 2 < x) {
                                    index = -1;
                                }
                            } else {
                                if (w + textObject.w / 2 < x) {
                                    index += 1;
                                }
                            }
                        } else {
                            // right
                            if (text_field.focusIndex === index) {
                                if (w + textObject.w / 2 > x) {
                                    index = -1;
                                }
                            } else {
                                if (w + textObject.w / 2 > x) {
                                    index -= 1;
                                }
                            }
                        }

                        if (text_field.selectIndex !== index) {
                            text_field.selectIndex = index;

                            if (text_field.selectIndex > -1) {
                                text_field.focusVisible = false;
                                textFieldBlinkingClearTimeoutService();
                            }

                            textFieldApplyChangesService(text_field);
                        }
                    } else {
                        if (w + textObject.w / 2 < x) {
                            const textObject = textData.textTable[index + 1];
                            if (!textObject || textObject.mode === "text") {
                                index += 1;
                            }
                        }

                        if (text_field.focusIndex !== index || text_field.selectIndex > -1) {
                            text_field.focusIndex  = index;
                            text_field.selectIndex = -1;
                            textFieldApplyChangesService(text_field);
                        }
                    }
                    return ;
                }

                if (idx === textData.textTable.length - 1
                    && x > w && y > yMin && yMax > y
                    && width > x
                ) {
                    const index = textData.textTable.length;
                    if (selected) {
                        if (text_field.selectIndex !== index) {
                            text_field.selectIndex = index;

                            if (text_field.focusIndex !== index) {
                                text_field.focusVisible = false;
                                textFieldBlinkingClearTimeoutService();
                                textFieldApplyChangesService(text_field);
                            }
                        }
                    } else {
                        if (text_field.focusIndex !== index || text_field.selectIndex > -1) {
                            text_field.focusIndex  = index;
                            text_field.selectIndex = -1;
                            textFieldApplyChangesService(text_field);
                        }
                    }
                    return ;
                }

                w += textObject.w;
                break;

            default:
                break;

        }

        if (!selected) {
            text_field.focusIndex  = textData.textTable.length;
            text_field.selectIndex = -1;
            if ($getBlinkingTimerId() === undefined) {
                textFieldBlinkingUseCase(text_field);
            } else {
                textFieldApplyChangesService(text_field);
            }
        }
    }
};