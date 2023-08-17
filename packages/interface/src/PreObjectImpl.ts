import { BlendModeImpl } from "./BlendModeImpl";

export interface PreObjectImpl
{
    isLayer: boolean;
    isUpdated: boolean | null;
    canApply: boolean | null;
    matrix: Float32Array | null;
    color: Float32Array | null;
    blendMode: BlendModeImpl;
    filters: any[] | null;
    sw: number;
    sh: number;
}