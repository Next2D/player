import { TextObjectImpl } from "./TextObjectImpl";

export interface TextStringObjectImpl extends TextObjectImpl {
    text: string;
    width: number;
    height: number;
    yIndex: number;
}