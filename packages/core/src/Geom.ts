import type { IGeom } from "./interface/IGeom";
import {
    ColorTransform,
    Matrix,
    Point,
    Rectangle
} from "@next2d/geom";

const geom: IGeom = {
    ColorTransform,
    Matrix,
    Point,
    Rectangle
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