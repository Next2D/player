import { BlendModeImpl } from "./BlendModeImpl";

export interface PreObjectImpl
{
    isFilter:    boolean;
    isUpdated:   boolean | null;
    canApply:    boolean | null;
    matrix:      Float32Array | null;
    color:       Float32Array | null;
    baseMatrix:  Float32Array | null;
    baseColor:   Float32Array | null;
    blendMode:   BlendModeImpl;
    filters:     any[] | null;
    layerWidth:  number;
    layerHeight: number;
    basePosition: {
        x: number,
        y: number
    };
    position: {
        dx: number,
        dy: number
    };
}