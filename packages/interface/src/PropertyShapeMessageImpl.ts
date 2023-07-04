import { PropertyMessageImpl } from "./PropertyMessageImpl";

export interface PropertyShapeMessageImpl extends PropertyMessageImpl {
    maxAlpha?: number;
    canDraw?: boolean;
    recodes?: Float32Array;
}