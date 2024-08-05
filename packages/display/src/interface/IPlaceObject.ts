import type { ILoopConfig } from "./ILoopConfig";
import type { ISurfaceFilter } from "./ISurfaceFilter";
import type { IFilterArray } from "./IFilterArray";
import type { IBlendMode } from "./IBlendMode";

export interface IPlaceObject {
    matrix?: number[];
    colorTransform?: number[];
    typedMatrix?: Float32Array;
    typedColorTransform?: Float32Array;
    blendMode?: IBlendMode;
    surfaceFilterList?: ISurfaceFilter[];
    filters?: IFilterArray;
    loop?: ILoopConfig;
}