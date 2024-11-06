import type { ITextFormatObject } from "./ITextFormatObject";
import type { ITextObjectMode } from "./ITextObjectMode";

export interface ITextObject {
    mode: ITextObjectMode;
    text: string;
    textFormat: ITextFormatObject;
    x: number;
    y: number;
    w: number;
    h: number;
    line: number;
}