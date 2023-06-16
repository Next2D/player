import { PointImpl } from "./PointImpl";
import { Rectangle } from "../player/next2d/geom/Rectangle";

export interface DragRulesImpl {
    lock: boolean;
    position: PointImpl;
    bounds: Rectangle | null
}