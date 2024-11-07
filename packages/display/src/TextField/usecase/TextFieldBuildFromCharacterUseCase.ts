import type { TextField } from "@next2d/text";
import type { ITextFieldCharacter } from "../../interface/ITextFieldCharacter";

/**
 * @description characterを元にTextFieldを構築
 *              Build TextField based on character
 *
 * @param  {TextField} text_field
 * @param  {ITextFieldCharacter} character
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, character: ITextFieldCharacter): void =>
{
    const textFormat = text_field.defaultTextFormat;
    textFormat.font          = character.font;
    textFormat.size          = character.size;
    textFormat.align         = character.align;
    textFormat.color         = character.color;
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

    // update textFormat
    text_field.defaultTextFormat = textFormat;

    // setup params
    text_field.type           = character.inputType;
    text_field.multiline      = character.multiline;
    text_field.wordWrap       = character.wordWrap;
    text_field.border         = character.border;
    text_field.scrollEnabled  = character.scroll;
    text_field.thickness      = character.thickness;
    text_field.thicknessColor = character.thicknessColor;

    switch (character.autoSize) {

        case 1:
            text_field.autoSize = character.align;
            break;

        case 2:
            text_field.autoFontSize = true;
            break;

        default:
            break

    }

    text_field.xMin = text_field.bounds.xMin = character.bounds.xMin;
    text_field.xMax = text_field.bounds.xMax = character.bounds.xMax;
    text_field.yMin = text_field.bounds.yMin = character.bounds.yMin;
    text_field.yMax = text_field.bounds.yMax = character.bounds.yMax + 4;
    
    text_field.text = character.text;
};