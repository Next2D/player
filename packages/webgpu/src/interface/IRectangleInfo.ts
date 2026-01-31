import type { IPoint } from "./IPoint";
import type { IPath } from "./IPath";

/**
 * @description 矩形の情報を保持する型
 *              Rectangle info type for stroke generation
 */
export interface IRectangleInfo {
    path: IPath;
    startUp: IPoint;
    startDown: IPoint;
    endUp: IPoint;
    endDown: IPoint;
}
