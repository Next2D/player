import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description 一時的なアタッチメントを解放（フィルター処理用）
 *              Releases a temporary attachment after filter processing
 *              テクスチャは即座に破棄せず、フレーム終了時に遅延解放します
 *
 * @param  {Map<string, IAttachmentObject>} attachments
 * @param  {IAttachmentObject[]} pendingReleases
 * @param  {IAttachmentObject} attachment
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    attachments: Map<string, IAttachmentObject>,
    pendingReleases: IAttachmentObject[],
    attachment: IAttachmentObject
): void => {
    // 名前を検索して削除（Map から削除するが、テクスチャは破棄しない）
    for (const [name, att] of attachments.entries()) {
        if (att.id === attachment.id) {
            attachments.delete(name);
            // フレーム終了時に遅延解放するためキューに追加
            pendingReleases.push(att);
            break;
        }
    }
};
