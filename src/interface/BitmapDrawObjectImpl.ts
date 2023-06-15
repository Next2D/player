import { DisplayObjectImpl } from "./DisplayObjectImpl";

export interface BitmapDrawObjectImpl {
    source: DisplayObjectImpl<any>;
    context: CanvasRenderingContext2D;
    callback: Function | null;
}
