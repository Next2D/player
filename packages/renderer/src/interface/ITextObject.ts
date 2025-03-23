import type { ITextFormat } from "./ITextFormat";
import type { ITextObjectMode } from "./ITextObjectMode";

export interface ITextObject {
    mode: ITextObjectMode;
    text: string;
    textFormat: ITextFormat;
    x: number;
    y: number;
    w: number;
    h: number;
    line: number;
}