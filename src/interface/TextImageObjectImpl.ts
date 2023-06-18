import { TextObjectImpl } from "./TextObjectImpl";

export interface TextImageObjectImpl extends TextObjectImpl {
    image: HTMLImageElement;
    src: string;
    loaded: boolean;
    y: number;
    width: number;
    height: number;
    hspace: number;
    vspace: number;
}