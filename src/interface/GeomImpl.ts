import { ColorTransform } from "../player/next2d/geom/ColorTransform";
import { Matrix } from "../player/next2d/geom/Matrix";
import { Point } from "../player/next2d/geom/Point";
import { Rectangle } from "../player/next2d/geom/Rectangle";
import { Transform } from "../player/next2d/geom/Transform";

export interface GeomImpl {
    ColorTransform: typeof ColorTransform;
    Matrix: typeof Matrix;
    Point: typeof Point;
    Rectangle: typeof Rectangle;
    Transform: typeof Transform;
}