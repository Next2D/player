import { ColorTransform } from "../next2d/geom/ColorTransform";
import { Matrix } from "../next2d/geom/Matrix";
import { Point } from "../next2d/geom/Point";
import { Rectangle } from "../next2d/geom/Rectangle";
import { Transform } from "../next2d/geom/Transform";

export interface GeomImpl {
    ColorTransform: typeof ColorTransform;
    Matrix: typeof Matrix;
    Point: typeof Point;
    Rectangle: typeof Rectangle;
    Transform: typeof Transform;
}