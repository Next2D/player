import type {
    ColorTransform,
    Matrix,
    Point,
    Rectangle,
    Transform
} from "@next2d/geom";

export interface IGeom {
    ColorTransform: typeof ColorTransform;
    Matrix: typeof Matrix;
    Point: typeof Point;
    Rectangle: typeof Rectangle;
    Transform: typeof Transform;
}