import type { StageDataImpl } from "./StageDataImpl";
import type { Character } from "./Character";

export interface LoaderInfoDataImpl {
    stage: StageDataImpl;
    characters: Character<any>[];
    symbols: Map<string, number>;
}