import { TextFormat } from "../player/next2d/text/TextFormat";
import { TextObjectModeImpl } from "./TextObjectModeImpl";

export interface TextObjectImpl {
    mode: TextObjectModeImpl;
    x: number;
    textFormat: TextFormat;
}