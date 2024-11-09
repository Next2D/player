import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { DisplayObject } from "../../DisplayObject";
import type { TextField } from "@next2d/text";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectConcatenatedMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectConcatenatedMatrixUseCase";
import {
    $getArray,
    $poolArray,
    $getMap,
    $poolMap,
} from "../../DisplayObjectUtil";

/**
 * @description コンテナ内のヒット判定
 *              Hit judgment in the container
 * 
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {CanvasRenderingContext2D} hit_context
 * @param  {Float32Array} matrix
 * @param  {IPlayerHitObject} hit_object
 * @param  {boolean} [mouse_children=true]
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = <P extends DisplayObjectContainer, D extends DisplayObject>(
    display_object_container: P,
    hit_context: CanvasRenderingContext2D,
    matrix: Float32Array,
    hit_object: IPlayerHitObject,
    mouse_children: boolean = true
): boolean => {

    const rawMatrix = displayObjectGetRawMatrixUseCase(display_object_container);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;
    

    const children = display_object_container.children as D[];
    if (!children.length) {
        return false;
    }

    // mask set
    const clips: D[]   = $getArray();
    const targets: D[] = $getArray();
    const clipIndexes: Map<number, number>  = $getMap();

    let clipDepth = 0;
    let clipIdx   = 0;
    for (let idx = 0; idx < children.length; ++idx) {

        const instance = children[idx];

        if (!instance.visible) {
            continue;
        }

        if (instance.clipDepth) {
            clipIdx   = clips.length;
            clipDepth = instance.clipDepth;
            clips.push(instance);
            continue;
        }

        // clip end
        if (clipDepth && instance.placeId > clipDepth) {
            clipIdx   = 0;
            clipDepth = 0;
        }

        // clip check on
        if (clipIdx) {
            clipIndexes.set(instance.instanceId, clipIdx);
        }

        targets.push(instance);
    }


    const mouseChildren = display_object_container.mouseChildren && mouse_children;

    let hit = false;
    while (targets.length) {

        const instance = targets.pop();
        if (!instance) {
            continue;
        }

        if (instance.isMask) {
            continue;
        }

        // mask target
        if (clipIndexes.has(instance.instanceId)) {

            const index = clipIndexes.get(instance.instanceId) as number;

            const clip = clips[index];
            if (!clip._$hit(hit_context, tMatrix, hit_object, true)) {
                continue;
            }

        }

        // mask hit test
        const maskInstance = instance.mask;
        if (maskInstance) {

            if (display_object_container === maskInstance.parent) {

                if (!maskInstance._$hit(hit_context, tMatrix, hit_object, true)) {
                    continue;
                }

            } else {

                const matrix = displayObjectConcatenatedMatrixUseCase(maskInstance);
                if (!maskInstance._$hit(hit_context, matrix.rawData, hit_object, true)) {
                    continue;
                }

            }

        }

        if (instance._$mouseHit(context, multiMatrix, options, mouseChildren)) {

            if (instance.root === instance) {
                return true;
            }

            if (!mouseChildren) {
                return true;
            }

            hit = true;
            if (instance instanceof InteractiveObject) {

                if (!instance.mouseEnabled) {
                    continue;
                }

                if (!hit_object.pointer) {

                    if (instance.isText
                        && (instance as unknown as TextField).type === "input"
                    ) {
                        hit_object.pointer = "text";
                    }

                    if ("buttonMode" in instance
                        && "useHandCursor" in instance
                        && instance.buttonMode
                        && instance.useHandCursor
                    ) {
                        hit_object.pointer = "pointer";
                    }

                }

                if (!hit_object.hit) {

                    hit_object.hit = !instance.mouseEnabled && instance._$hitObject
                        ? instance._$hitObject
                        : instance;

                }

                return true;
            }

        }

    }

    // pool
    $poolArray(clips);
    $poolArray(targets);
    $poolMap(clipIndexes);

    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }

    // not found
    return hit;
};