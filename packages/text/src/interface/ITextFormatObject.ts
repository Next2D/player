import type { ITextFormatAlign } from "./ITextFormatAlign";

export interface ITextFormatObject {
    align: ITextFormatAlign | null;
    bold: boolean | null;
    color: number | null;
    font: string | null;
    italic: boolean | null;
    leading: number | null;
    leftMargin: number | null;
    letterSpacing: number | null;
    rightMargin: number | null;
    size: number | null;
    underline: boolean | null;
}