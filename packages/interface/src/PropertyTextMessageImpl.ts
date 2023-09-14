import { PropertyMessageImpl } from "./PropertyMessageImpl";
import { TextDataImpl } from "./TextDataImpl";
import { TextFieldAutoSizeImpl } from "./TextFieldAutoSizeImpl";

export interface PropertyTextMessageImpl extends PropertyMessageImpl {
    textData?: TextDataImpl<any>[];
    limitWidth: number;
    limitHeight: number;
    textHeight: number;
    autoSize: TextFieldAutoSizeImpl;
    wordWrap: boolean;
    border: boolean;
    borderColor?: number;
    background: boolean;
    backgroundColor?: number;
    thickness: number;
    thicknessColor?: number;
}