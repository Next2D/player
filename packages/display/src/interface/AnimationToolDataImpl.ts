import { StageDataImpl } from "./StageDataImpl";

export interface AnimationToolDataImpl {
    type: "json";
    stage: StageDataImpl;
    characters: any[]; // todo
    symbols: any[]; // todo
}