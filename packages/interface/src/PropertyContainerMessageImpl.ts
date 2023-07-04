import { PropertyMessageImpl } from "./PropertyMessageImpl";

export interface PropertyContainerMessageImpl extends PropertyMessageImpl {
    maxAlpha?: number;
    canDraw?: boolean;
    recodes?: Float32Array;
}