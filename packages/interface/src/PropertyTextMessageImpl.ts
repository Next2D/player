import { PropertyMessageImpl } from "./PropertyMessageImpl";
import { TextDataImpl } from "./TextDataImpl";
import { TextFormatVerticalAlignImpl } from "./TextFormatVerticalAlignImpl";
import { TextFieldAutoSizeImpl } from "./TextFieldAutoSizeImpl";

export interface PropertyTextMessageImpl extends PropertyMessageImpl {
    textAreaActive?: boolean;
    textData?: TextDataImpl<any>[];
    scrollV: number;
    limitWidth: number;
    limitHeight: number;
    textHeight: number;
    verticalAlign: TextFormatVerticalAlignImpl;
    autoSize: TextFieldAutoSizeImpl;
    wordWrap: boolean;
    border: boolean;
    borderColor?: number;
    background: boolean;
    backgroundColor?: number;
    thickness: number;
    thicknessColor?: number;
}