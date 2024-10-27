import type { TextFormat } from "../TextFormat";
import type { ITextObjectMode } from "./ITextObjectMode";

export interface ITextObject {
    mode: ITextObjectMode;
    text: string;
    textFormat: TextFormat;
    x: number;
    y: number;
    w: number;
    h: number;
    line: number;
}