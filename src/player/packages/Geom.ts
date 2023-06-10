import { ColorTransform } from "../next2d/geom/ColorTransform";
import { Matrix } from "../next2d/geom/Matrix";
import { Point } from "../next2d/geom/Point";
import { Rectangle } from "../next2d/geom/Rectangle";
import { Transform } from "../next2d/geom/Transform";
import { GeomImpl } from "../../interface/GeomImpl";

const geom: GeomImpl = {
    ColorTransform,
    Matrix,
    Point,
    Rectangle,
    Transform
};

Object.entries(geom).forEach(([key, GeomClass]) =>
{
    Object.defineProperty(geom, key, {
        get()
        {
            return GeomClass;
        }
    });
});

export { geom };