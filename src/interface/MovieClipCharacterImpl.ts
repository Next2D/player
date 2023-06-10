import { CharacterImpl } from "./CharacterImpl";
import { MovieClipSoundObjectImpl } from "./MovieClipSoundObjectImpl";
import { MovieClipActionObjectImpl } from "./MovieClipActionObjectImpl";
import { MovieClipLabelObjectImpl } from "./MovieClipLabelObjectImpl";

export interface MovieClipCharacterImpl extends CharacterImpl {
    actions: MovieClipActionObjectImpl[];
    symbol: string;
    extends: string;
    totalFrame: number;
    controller: any[];
    dictionary: any[];
    labels: MovieClipLabelObjectImpl[];
    placeMap: any[];
    placeObjects: any[];
    sounds: MovieClipSoundObjectImpl[];
}