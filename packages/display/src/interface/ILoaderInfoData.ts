import type { IStageData } from "./IStageData";
import type { ICharacter } from "./ICharacter";

export interface ILoaderInfoData {
    stage: IStageData;
    characters: ICharacter[];
    symbols: Map<string, number>;
}