import { CharacterImpl } from "./CharacterImpl";
import { MovieClipSoundObjectImpl } from "./MovieClipSoundObjectImpl";
import { MovieClipActionObjectImpl } from "./MovieClipActionObjectImpl";
import { MovieClipLabelObjectImpl } from "./MovieClipLabelObjectImpl";
import {PlaceObjectImpl} from "./PlaceObjectImpl";
import {DictionaryTagImpl} from "./DictionaryTagImpl";

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