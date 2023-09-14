import { TextFormat } from "../TextFormat";

export interface OptionsImpl {
    width: number;
    multiline: boolean;
    wordWrap: boolean;
    textFormats: TextFormat[] | null
    subFontSize?: number;
}