import { StageDataImpl } from "./StageDataImpl";
import { Character } from "./Character";

export interface LoaderInfoDataImpl {
    stage: StageDataImpl;
    characters: Character<any>[];
    symbols: Map<string, number>;
}