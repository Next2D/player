import type { IMovieClipSoundObject } from "./IMovieClipSoundObject";
import type { IMovieClipActionObject } from "./IMovieClipActionObject";
import type { IMovieClipLabelObject } from "./IMovieClipLabelObject";
import type { IPlaceObject } from "./IPlaceObject";
import type { IDictionaryTag } from "./IDictionaryTag";

export interface IMovieClipCharacter {
    extends: string;
    totalFrame: number;
    controller: Array<Array<number>>;
    dictionary: IDictionaryTag[];
    placeMap: Array<Array<number>>;
    placeObjects: IPlaceObject[];
    labels?: IMovieClipLabelObject[];
    actions?: IMovieClipActionObject[];
    symbol?: string;
    sounds?: IMovieClipSoundObject[];
}