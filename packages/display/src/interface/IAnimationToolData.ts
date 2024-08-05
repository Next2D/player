import { IStageData } from "./IStageData";

export interface IAnimationToolData {
    type: "json";
    stage: IStageData;
    characters: any[]; // todo
    symbols: any[]; // todo
}