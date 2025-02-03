import type { ITextFormatAlign } from "./ITextFormatAlign";
import type { ITextFieldType } from "./ITextFieldType";
import type { IBounds } from "./IBounds";

export interface ITextFieldCharacter {
    symbol?: string;
    extends: string;
    font: string;
    size: number;
    align: ITextFormatAlign;
    color: number;
    leading: number;
    letterSpacing: number;
    leftMargin: number;
    rightMargin: number;
    fontType: number;
    autoSize: number;
    inputType: ITextFieldType;
    multiline: boolean;
    wordWrap: boolean;
    border: boolean;
    scroll: boolean;
    thickness: number;
    thicknessColor: number;
    bounds: IBounds;
    text: string;
}