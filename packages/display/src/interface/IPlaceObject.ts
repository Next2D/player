import type { ILoopConfig } from "./ILoopConfig";
import type { ISurfaceFilter } from "./ISurfaceFilter";
import type { IFilterArray } from "./IFilterArray";
import type { IBlendMode } from "./IBlendMode";

export interface IPlaceObject {
    matrix?: number[];
    typedMatrix?: Float32Array;
    colorTransform?: number[];
    typedColorTransform?: Float32Array;
    blendMode?: IBlendMode;
    surfaceFilterList?: ISurfaceFilter[];
    filters?: IFilterArray;
    loop?: ILoopConfig;
}