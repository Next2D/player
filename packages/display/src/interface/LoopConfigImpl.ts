import type { LoopTypeImpl } from "./LoopTypeImpl";

export interface LoopConfigImpl {
    type: LoopTypeImpl;
    frame: number;
    start: number;
    end: number;
    tweenFrame?: number;
}