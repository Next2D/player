import type { TextField } from "../../TextField";
import { Point } from "@next2d/geom";
import { stage } from "@next2d/display";
import {
    $textArea,
    $mainCanvasPosition
} from "../../TextUtil";

/**
 * @type {number}
 * @private
 */
const $devicePixelRatio: number = window.devicePixelRatio;

/**
 * @description フォーカスしているテキストのカーソル位置（ローカル座標）を算出します。
 *              入力中の文字の「真裏」に input(textarea) を配置するため、カーソルのある行の
 *              上端を基準に x/y を返却します。これにより IME の変換文字が canvas 側の文字に
 *              ちょうど重なり、他の文字に被らないようにします。カーソルが文末にある場合
 *              (textTable[focusIndex] が存在しない場合)も直前の文字から行と x を求めます。
 *              Calculate the caret position (local coordinates) of the focused text.
 *              Returns x/y based on the top of the caret line so that the input(textarea)
 *              is placed directly behind the character being typed, making the IME
 *              composition overlap the canvas character (and not other characters).
 *              Handles the end-of-text case (textTable[focusIndex] is undefined) by using
 *              the previous character.
 *
 *              あわせて、input(textarea) の高さ・フォントサイズを canvas のテキストサイズへ
 *              合わせるため、カーソル行の行高(lineHeight)とフォントサイズ(fontSize)も返却します。
 *              Also returns the caret line height and font size so that the input(textarea)
 *              height/font-size can match the canvas text size.
 *
 * @param  {TextField} text_field
 * @return {{ x: number, y: number, lineHeight: number, fontSize: number }}
 * @method
 * @private
 */
const calcCaretLocalPosition = (
    text_field: TextField
): { x: number; y: number; lineHeight: number; fontSize: number } =>
{
    const textData = text_field.$textData;
    if (!textData) {
        return { "x": 0, "y": 0, "lineHeight": 0, "fontSize": 0 };
    }

    const textTable = textData.textTable;

    // カーソル行の決定
    let caretLine = 0;
    const focusIndex = text_field.focusIndex;
    const focusTextObject = textTable[focusIndex];
    if (focusTextObject) {
        // 改行・折り返しの直前にカーソルがある場合は前の行の末尾を指す
        caretLine = focusTextObject.mode === "break" || focusTextObject.mode === "wrap"
            ? focusTextObject.line - 1
            : focusTextObject.line;
    } else {
        // 文末（textTable[focusIndex] が存在しない）は直前の文字の行を採用
        const lastTextObject = textTable[textTable.length - 1];
        caretLine = lastTextObject ? lastTextObject.line : 0;
    }

    if (caretLine < 0) {
        caretLine = 0;
    }

    // カーソル行で、カーソルより前にある文字幅の合計（= カーソルの x 位置）
    let x = 0;
    for (let idx = 1; idx < textTable.length; ++idx) {
        if (idx >= focusIndex) {
            break;
        }
        const textObject = textTable[idx];
        if (!textObject || textObject.mode !== "text" || textObject.line !== caretLine) {
            continue;
        }
        x += textObject.w;
    }

    // カーソル行の上端（= 入力文字の真裏）
    let y = 0;
    for (let idx = 0; idx < caretLine; ++idx) {
        y += textData.heightTable[idx] || 0;
    }

    // カーソル行の行高（= input の高さに使用）
    const lineHeight = textData.heightTable[caretLine] || 0;

    // カーソル行のフォントサイズ（= input の font-size に使用）。
    // カーソル位置までの最後の文字サイズを優先し、無ければ defaultTextFormat を採用する。
    let fontSize = text_field.defaultTextFormat?.size || 0;
    for (let idx = 1; idx < textTable.length; ++idx) {
        const textObject = textTable[idx];
        if (!textObject || textObject.mode !== "text" || textObject.line !== caretLine) {
            continue;
        }
        if (textObject.textFormat?.size) {
            fontSize = textObject.textFormat.size;
        }
        if (idx >= focusIndex) {
            break;
        }
    }

    return { x, y, lineHeight, fontSize };
};

/**
 * @description フォーカスしているテキストの位置にテキストエリアを移動します。
 *              入力中の文字の真裏に input(textarea) を配置し、高さ・フォントサイズを
 *              canvas のテキストサイズに合わせます。
 *              Move the text area to the position of the text that is focusing.
 *              The input(textarea) is placed directly behind the character being typed,
 *              and its height/font-size are matched to the canvas text size.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    const caret = calcCaretLocalPosition(text_field);

    // スクロール量を反映して、表示されているカーソル位置に補正する
    let localX = caret.x;
    if (text_field.scrollX > 0) {
        const width = text_field.width;
        localX -= text_field.scrollX * (text_field.textWidth - width) / width;
    }

    let localY = caret.y;
    if (text_field.scrollY > 0) {
        const height = text_field.height;
        localY -= text_field.scrollY * (text_field.textHeight - height) / height;
    }

    // ローカル座標をステージ座標へ変換（TextField のスケール・回転・配置を考慮）
    const point = text_field.localToGlobal(new Point(localX, localY));

    // ステージ座標 → 画面(CSS)座標へ変換。
    // PlayerSetCurrentMousePointService の逆変換に対応する。
    const scale = stage.rendererScale / $devicePixelRatio;
    const tx = (stage.rendererWidth  - stage.stageWidth  * stage.rendererScale) / 2;
    const ty = (stage.rendererHeight - stage.stageHeight * stage.rendererScale) / 2;

    $textArea.style.left = `${$mainCanvasPosition.x + tx / $devicePixelRatio + point.x * scale}px`;
    $textArea.style.top  = `${$mainCanvasPosition.y + ty / $devicePixelRatio + point.y * scale}px`;

    // canvas のテキストサイズに合わせて input の高さ・フォントサイズを設定する
    const lineHeight = caret.lineHeight;
    if (lineHeight > 0) {
        const fontSize = caret.fontSize || lineHeight;
        $textArea.style.height   = `${lineHeight * scale}px`;
        $textArea.style.fontSize = `${fontSize * scale}px`;
        $textArea.style.lineHeight = `${lineHeight * scale}px`;
    }
};
