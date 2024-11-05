import { ITextFieldAutoSize } from "./ITextFieldAutoSize";

export interface ITextSetting {
    width: number;
    height: number;
    stopIndex: number;
    scrollX: number;
    scrollY: number;
    textWidth: number;
    textHeight: number;
    rawWidth: number;
    rawHeight: number;
    autoSize: ITextFieldAutoSize;
    focusIndex: number;
    focusVisible: boolean;
    thickness: number;
    thicknessColor: number;
    wordWrap: boolean;
    border: boolean;
    borderColor: number;
    background: boolean;
    backgroundColor: number;
    defaultColor: number;
    defaultSize: number;
}