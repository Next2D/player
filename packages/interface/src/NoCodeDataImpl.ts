import { StageDataImpl } from "./StageDataImpl";

export interface NoCodeDataImpl {
    type: "json";
    stage: StageDataImpl;
    characters: any[];
    symbols: any[];
}