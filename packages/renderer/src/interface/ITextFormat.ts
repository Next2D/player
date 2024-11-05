import type { ITextFormatAlign } from "./ITextFormatAlign";

export interface ITextFormat {
    align: ITextFormatAlign;
    bold: boolean;
    color: number;
    font: string;
    italic: boolean;
    leading: number;     
    leftMargin: number;   
    letterSpacing: number;   
    rightMargin: number;   
    size: number;   
    underline: boolean;   
}