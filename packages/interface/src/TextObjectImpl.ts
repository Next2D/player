import { TextFormat } from "@next2d/text";
import { TextObjectModeImpl } from "./TextObjectModeImpl";

export interface TextObjectImpl {
    mode: TextObjectModeImpl;
    text: string;
    textFormat: TextFormat;
    x: number;
    y: number;
    w: number;
    h: number;
    line: number;
}