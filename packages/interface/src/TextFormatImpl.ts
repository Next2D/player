import { TextFormatAlignImpl } from "./TextFormatAlignImpl";

export interface TextFormatImpl {
    _$font: string;
    _$size: number;
    _$color: number;
    _$bold: boolean;
    _$italic: boolean;
    _$underline: boolean;
    _$align: TextFormatAlignImpl;
    _$leftMargin: number;
    _$rightMargin: number;
    _$indent: number;
    _$leading: number;
    _$blockIndent: number;
    _$letterSpacing: number;
}