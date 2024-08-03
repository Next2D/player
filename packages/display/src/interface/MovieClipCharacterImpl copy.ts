import type { CharacterImpl } from "./CharacterImpl";
import type { MovieClipSoundObjectImpl } from "./MovieClipSoundObjectImpl";
import type { MovieClipActionObjectImpl } from "./MovieClipActionObjectImpl";
import type { MovieClipLabelObjectImpl } from "./MovieClipLabelObjectImpl";
import type { PlaceObjectImpl } from "./PlaceObjectImpl";
import type { DictionaryTagImpl } from "./DictionaryTagImpl";

export interface MovieClipCharacterImpl extends CharacterImpl {
    extends: string;
    totalFrame: number;
    controller: Array<Array<number>>;
    dictionary: DictionaryTagImpl[];
    placeMap: Array<Array<number>>;
    placeObjects: PlaceObjectImpl[];
    labels?: MovieClipLabelObjectImpl[];
    actions?: MovieClipActionObjectImpl[];
    symbol?: string;
    sounds?: MovieClipSoundObjectImpl[];
}