import type { TextFormat } from "../TextFormat";

export interface IOptions {
    width: number;
    multiline: boolean;
    wordWrap: boolean;
    textFormats: TextFormat[] | null
    subFontSize?: number;
}