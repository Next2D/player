import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { DisplayObject } from "../../DisplayObject";
import type { Shape } from "../../Shape";
import type { Sprite } from "../../Sprite";
import type { InteractiveObject } from "../../InteractiveObject";
import type { TextField } from "@next2d/text";
import type { Video } from "@next2d/media";
import { Matrix } from "@next2d/geom";
import { execute as displayObjectGetRawMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as displayObjectConcatenatedMatrixUseCase } from "../../DisplayObject/usecase/DisplayObjectConcatenatedMatrixUseCase";
import { execute as shapeHitTestUseCase } from "../../Shape/usecase/ShapeHitTestUseCase";
import { execute as textFieldHitTestUseCase } from "../../TextField/usecase/TextFieldHitTestUseCase";
import { execute as videoHitTestUseCase } from "../../Video/usecase/VideoHitTestUseCase";
import {
    $getArray,
    $poolArray,
    $getMap,
    $poolMap
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

    const children = display_object_container.children as D[];
    if (!children.length) {
        return false;
    }

    const rawMatrix = displayObjectGetRawMatrixUseCase(display_object_container);
    const tMatrix = rawMatrix
        ? Matrix.multiply(matrix, rawMatrix)
        : matrix;

    // mask set
    const clips: D[]   = $getArray();
    const targets: D[] = $getArray();
    const clipIndexes: Map<number, number>  = $getMap();

    let clipDepth = 0;
    let clipIdx   = 0;
    for (let idx = 0; idx < children.length; ++idx) {

        const instance = children[idx];
        if (!instance) {
            continue;
        }

        if (instance.isMask) {
            continue;
        }

        if (instance.clipDepth) {
            clipIdx   = clips.length;
            clipDepth = instance.clipDepth;
            clips.push(instance);
            continue;
        }

        // fixed logic
        if (!instance.visible) {
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
            if (!index) {
                continue;
            }

            const clip = clips[index];
            if (!clip) {
                continue;
            }

            let hitTest = false;
            switch (true) {

                case clip.isContainerEnabled:
                    hitTest = execute(
                        clip as unknown as DisplayObjectContainer,
                        hit_context, tMatrix, hit_object, mouseChildren
                    );
                    break;

                case clip.isShape:
                    hitTest = shapeHitTestUseCase(
                        clip as unknown as Shape,
                        hit_context, tMatrix, hit_object
                    );
                    break;

                case clip.isText:
                    hitTest = textFieldHitTestUseCase(
                        clip as unknown as TextField,
                        hit_context, tMatrix, hit_object
                    );
                    break;

                case clip.isVideo:
                    hitTest = videoHitTestUseCase(
                        clip as unknown as Video,
                        hit_context, tMatrix, hit_object
                    );
                    break;

                default:
                    break;

            }

            if (!hitTest) {
                continue;
            }
        }

        // mask hit test
        const maskInstance = instance.mask as D | null;
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

        let hitTest = false;
        switch (true) {

            case instance.isContainerEnabled:
                hitTest = execute(
                    instance as unknown as DisplayObjectContainer,
                    hit_context, tMatrix, hit_object, mouseChildren
                );
                break;

            case instance.isShape:
                hitTest = shapeHitTestUseCase(
                    instance as unknown as Shape,
                    hit_context, tMatrix, hit_object
                );
                break;

            case instance.isText:
                hitTest = textFieldHitTestUseCase(
                    instance as unknown as TextField,
                    hit_context, tMatrix, hit_object
                );
                break;

            case instance.isVideo:
                hitTest = videoHitTestUseCase(
                    instance as unknown as Video,
                    hit_context, tMatrix, hit_object
                );
                break;

            default:
                break;

        }

        if (!hitTest) {
            continue;
        }

        hit = true;
        if (!mouseChildren) {
            break;
        }

        if (!instance.isInteractive) {
            continue;
        }

        if (!(instance as unknown as InteractiveObject).mouseEnabled) {
            continue;
        }

        if (hit_object.pointer === "auto") {

            switch (true) {

                case instance.isText:
                    if ((instance as unknown as TextField).type === "input") {
                        hit_object.pointer = "text";
                    }
                    break;

                case instance.isSprite:
                    if ((instance as unknown as Sprite).buttonMode
                        && (instance as unknown as Sprite).useHandCursor
                    ) {
                        hit_object.pointer = "pointer";
                    }
                    break;

                default:
                    hit_object.pointer = "pointer";
                    break;

            }
        }

        if (!hit_object.hit) {
            hit_object.hit = instance;
        }

        break;
    }

    // pool
    $poolArray(clips);
    $poolArray(targets);
    $poolMap(clipIndexes);

    if (tMatrix !== matrix) {
        Matrix.release(tMatrix);
    }

    return hit;
};