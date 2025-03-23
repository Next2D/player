import type {
    ColorTransform,
    Matrix,
    Point,
    Rectangle
} from "@next2d/geom";

export interface IGeom {
    ColorTransform: typeof ColorTransform;
    Matrix: typeof Matrix;
    Point: typeof Point;
    Rectangle: typeof Rectangle;
}