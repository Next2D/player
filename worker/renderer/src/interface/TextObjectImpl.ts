import { TextFormatImpl } from "./TextFormatImpl";
import { TextObjectModeImpl } from "./TextObjectModeImpl";

export interface TextObjectImpl {
    mode: TextObjectModeImpl;
    x: number;
    textFormat: TextFormatImpl;
}