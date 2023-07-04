import { GeomImpl } from "@next2d/interface";
import {
    ColorTransform,
    Matrix,
    Point,
    Rectangle,
    Transform
} from "@next2d/geom";

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