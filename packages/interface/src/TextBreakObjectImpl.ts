import { TextObjectImpl } from "./TextObjectImpl";
import { TextObjectModeImpl } from "./TextObjectModeImpl";
import { TextFormat } from "@next2d/text";

export interface TextBreakObjectImpl extends TextObjectImpl {
    mode: TextObjectModeImpl;
    x: number;
    yIndex: number;
    textFormat: TextFormat;
}