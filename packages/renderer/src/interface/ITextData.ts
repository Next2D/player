import type { ITextObject } from "./ITextObject";

export interface ITextData {
    ascentTable: number[];
    heightTable: number[];
    lineTable: ITextObject[];
    textTable: ITextObject[];
    widthTable: number[];
}