import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { $context } from "../../WebGLUtil";

/**
 * @description コンテナレイヤーのスタック
 *              Container layer stack
 *
 * @type {IAttachmentObject[]}
 * @protected
 */
export const $containerLayerStack: IAttachmentObject[] = [];

/**
 * @description コンテナのフィルター/ブレンド用のレイヤーを開始します。
 *              Begin a container layer for filter/blend processing.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (width: number, height: number): void => {

    // レイヤー切り替え前に、今のメインFBOに対する未描画のインスタンスをフラッシュ
    $context.drawArraysInstanced();

    const mainAttachment = $context.$mainAttachmentObject as IAttachmentObject;

    // 現在のmainAttachmentObjectをスタックに保存
    $containerLayerStack.push(mainAttachment);

    // メインと同じサイズの一時アタッチメントを作成
    const layerAttachment = frameBufferManagerGetAttachmentObjectUseCase(width, height, false);

    // 一時アタッチメントをmainに設定
    $context.$mainAttachmentObject = layerAttachment;

    // 一時アタッチメントをバインド
    $context.bind(layerAttachment);
};
