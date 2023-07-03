import { TextFormat } from "@next2d/text";
import { TextObjectModeImpl } from "./TextObjectModeImpl";

export interface TextObjectImpl {
    mode: TextObjectModeImpl;
    x: number;
    textFormat: TextFormat;
}