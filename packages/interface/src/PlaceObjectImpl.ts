import { LoopConfigImpl } from "./LoopConfigImpl";
import { SurfaceFilterImpl } from "./SurfaceFilterImpl";
import { FilterArrayImpl } from "./FilterArrayImpl";
import { BlendModeImpl } from "./BlendModeImpl";

export interface PlaceObjectImpl {
    matrix?: number[] | Float32Array;
    colorTransform?: number[] | Float32Array;
    blendMode?: BlendModeImpl;
    surfaceFilterList?: SurfaceFilterImpl[];
    filters?: FilterArrayImpl;
    loop?: LoopConfigImpl;
}