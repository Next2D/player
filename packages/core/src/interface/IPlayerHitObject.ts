import type { IDisplayObject } from "./IDisplayObject";

export interface IPlayerHitObject {
    x: number;
    y: number;
    pointer: string;
    hit: IDisplayObject<any> | null;
}