import type { LoopConfigImpl } from "./LoopConfigImpl";
import type { SurfaceFilterImpl } from "./SurfaceFilterImpl";
import type { FilterArrayImpl } from "./FilterArrayImpl";
import type { BlendModeImpl } from "./BlendModeImpl";

export interface PlaceObjectImpl {
    matrix?: number[];
    colorTransform?: number[];
    typedMatrix?: Float32Array;
    typedColorTransform?: Float32Array;
    blendMode?: BlendModeImpl;
    surfaceFilterList?: SurfaceFilterImpl[];
    filters?: FilterArrayImpl;
    loop?: LoopConfigImpl;
}