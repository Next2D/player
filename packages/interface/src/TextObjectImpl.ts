import { TextFormat } from "../../text/src/TextFormat";
import { TextObjectModeImpl } from "./TextObjectModeImpl";

export interface TextObjectImpl {
    mode: TextObjectModeImpl;
    x: number;
    textFormat: TextFormat;
}