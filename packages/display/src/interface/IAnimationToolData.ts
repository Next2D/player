import type { IStageData } from "./IStageData";
import type { ICharacter } from "./ICharacter";

export interface IAnimationToolData {
    type: "json";
    stage: IStageData;
    characters: ICharacter[];
    symbols: Array<Array<string | number>>;
}