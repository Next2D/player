import type { IAttributeObject } from "./IAttributeObject";

/**
 * @description テキストノード
 *              Text node
 */
export interface IHtmlTextNode {
    readonly type: "text";
    readonly value: string;
}

/**
 * @description 要素ノード
 *              Element node
 */
export interface IHtmlElementNode {
    readonly type: "element";
    readonly tagName: string;
    readonly attributes: IAttributeObject[];
    readonly children: IHtmlNode[];
}

/**
 * @description HTMLノード共用型
 *              HTML node union type
 */
export type IHtmlNode = IHtmlTextNode | IHtmlElementNode;
