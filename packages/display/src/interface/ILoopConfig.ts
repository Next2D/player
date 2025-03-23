import type { ILoopType } from "./ILoopType";

export interface ILoopConfig {
    type: ILoopType;
    frame: number;
    start: number;
    end: number;
    tweenFrame?: number;
}