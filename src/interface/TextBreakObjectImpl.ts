import { TextObjectImpl } from "./TextObjectImpl";
import { TextObjectModeImpl } from "./TextObjectModeImpl";
import { TextFormat } from "../player/next2d/text/TextFormat";

export interface TextBreakObjectImpl extends TextObjectImpl {
    mode: TextObjectModeImpl;
    x: number;
    yIndex: number;
    textFormat: TextFormat;
}