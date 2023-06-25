import { ColorTransform } from "../../geom/src/ColorTransform";
import { Matrix } from "../../geom/src/Matrix";
import { Point } from "../../geom/src/Point";
import { Rectangle } from "../../geom/src/Rectangle";
import { Transform } from "../../geom/src/Transform";

export interface GeomImpl {
    ColorTransform: typeof ColorTransform;
    Matrix: typeof Matrix;
    Point: typeof Point;
    Rectangle: typeof Rectangle;
    Transform: typeof Transform;
}