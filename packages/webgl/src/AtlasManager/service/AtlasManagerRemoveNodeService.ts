import type { Node } from "@next2d/texture-packer";
import { $rootNodes } from "../../AtlasManager";

/**
 * @description アトラスの座標情報ノードを削除
 *              Remove the coordinate information node of the atlas
 * 
 * @param  {Node} node 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (node: Node): void =>
{
    const rootNode = $rootNodes[node.index];
    if (!rootNode) {
        return ;
    }
    rootNode.dispose(node.x, node.y, node.w, node.h);
}