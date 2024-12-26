import type { IPath } from "../../interface/IPath";
import type { IFillMesh } from "../../interface/IFillMesh";
import { execute as meshFillGenerateService } from "../service/MeshFillGenerateService";
import {
    $context,
    $getViewportWidth,
    $getViewportHeight
} from "../../WebGLUtil";

/**
 * @description 塗りのメッシュを生成する
 *              Generate a fill mesh
 *
 * @param  {IPath[]} vertices
 * @return {IFillMesh}
 * @method
 * @protected
 */
export const execute = (
    vertices: IPath[],
    style: "fill" | "stroke" = "fill"
): IFillMesh => {

    const colorStyle = style === "fill"
        ? $context.$fillStyle
        : $context.$strokeStyle;

    const red   = colorStyle[0];
    const green = colorStyle[1];
    const blue  = colorStyle[2];
    const alpha = colorStyle[3];

    const matrix = $context.$matrix;
    const width  = $getViewportWidth();
    const height = $getViewportHeight();

    const a  = matrix[0] / width;
    const b  = matrix[1] / width;
    const c  = matrix[3] / height;
    const d  = matrix[4] / height;
    const tx = matrix[6] / width;
    const ty = matrix[7] / height;

    let length = 0;
    for (let idx = 0; idx < vertices.length; ++idx) {
        length += (vertices[idx].length / 3 - 2) * 51;
    }

    const buffer = new Float32Array(length);

    let currentIndex = 0;
    for (let idx = 0; idx < vertices.length; ++idx) {
        currentIndex = meshFillGenerateService(
            vertices[idx], buffer, currentIndex,
            a, b, c, d, tx, ty,
            red, green, blue, alpha
        );
    }

    return {
        "buffer": buffer,
        "indexCount": currentIndex
    };
};