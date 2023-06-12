import { BlendModeImpl } from "./BlendModeImpl";

export interface PropertyMessageImpl {
    command: string;
    instanceId: number;
    visible: boolean;
    isMask: boolean;
    clipDepth: number;
    depth: number;
    maskId: number;
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
    grid?: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
}