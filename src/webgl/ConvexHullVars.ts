interface Vars {
    vertices: Array<number | boolean> | null;
    subhulls: number[];
    subhullsIndex: number;
    extremePoints: number[];
    extremePointsIndex: number;
    t: number;
    hulls: Float32Array[];
    hullsIndex: number;
}

export const ConvexHullVars: Vars = {
    "vertices": null,
    "subhulls": new Array(512),
    "subhullsIndex": 0,
    "extremePoints": new Array(32),
    "extremePointsIndex": 0,
    "t": 0,
    "hulls": [new Float32Array(16), new Float32Array(64), new Float32Array(256)],
    "hullsIndex": 0
};