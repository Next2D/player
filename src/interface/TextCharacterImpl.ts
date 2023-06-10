import { CharacterImpl } from "./CharacterImpl";
import { TextFormatAlignImpl } from "./TextFormatAlignImpl";
import { TextFieldTypeImpl } from "./TextFieldTypeImpl";
import { BoundsImpl } from "./BoundsImpl";

export interface TextCharacterImpl extends CharacterImpl {
    symbol: string;
    extends: string;
    text: string;
    font: string;
    size: number;
    align: TextFormatAlignImpl;
    color: number;
    leading: number;
    letterSpacing: number;
    leftMargin: number;
    rightMargin: number;
    fontType: number;
    inputType: TextFieldTypeImpl;
    multiline: boolean;
    wordWrap: boolean;
    border: boolean;
    scroll: boolean;
    thickness: number;
    thicknessColor: number;
    originBounds: BoundsImpl;
    autoSize: number;
}