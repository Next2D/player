import { PropertyMessageImpl } from "./PropertyMessageImpl";

export interface PropertyVideoMessageImpl extends PropertyMessageImpl {
    smoothing?: boolean;
    imageBitmap?: ImageBitmap;
}