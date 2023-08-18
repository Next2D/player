import { BlendModeImpl } from "./BlendModeImpl";
import { GridImpl } from "./GridImpl";

export interface PropertyMessageImpl {
    command: string;
    buffer: Float32Array;
    instanceId?: number;
    parentId?: number;
    visible?: boolean;
    isMask?: boolean;
    clipDepth?: number;
    depth?: number;
    maskId?: number;
    loaderInfoId?: number;
    characterId?: number;
    maskMatrix?: Float32Array;
    xMin?: number;
    yMin?: number;
    xMax?: number;
    yMax?: number;
    a?: number;
    b?: number;
    c?: number;
    d?: number;
    tx?: number;
    ty?: number;
    f0?: number;
    f1?: number;
    f2?: number;
    f3?: number;
    f4?: number;
    f5?: number;
    f6?: number;
    f7?: number;
    filters?: any[];
    blendMode?: BlendModeImpl;
    matrixBase?: Float32Array;
    grid?: GridImpl;
}