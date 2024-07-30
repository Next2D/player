import { DisplayObjectImpl } from "./DisplayObjectImpl";

export interface PlayerHitObjectImpl {
    x: number;
    y: number;
    pointer: string;
    hit: DisplayObjectImpl<any>|null;
}