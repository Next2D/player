import { execute as meshAddLineJoinUseCase } from "./MeshAddLineJoinUseCase";
import { execute as meshAddLineCapUseCase } from "./MeshAddLineCapUseCase";
import { $getVertexBufferData } from "../../Mesh";

export const execute = (
    vertex_begin_offset: number,
    vertex_end_offset: number,
): void => {

    const vbd: Float32Array = $getVertexBufferData();
    const stx1: number = vbd[vertex_begin_offset];
    const sty1: number = vbd[vertex_begin_offset + 1];
    const stx2: number = vbd[vertex_begin_offset + 2];
    const sty2: number = vbd[vertex_begin_offset + 3];
    const edx1: number = vbd[vertex_end_offset - 7];
    const edy1: number = vbd[vertex_end_offset - 6];
    const edx2: number = vbd[vertex_end_offset - 5];
    const edy2: number = vbd[vertex_end_offset - 4];

    const indexBeginOffset: number = vertex_begin_offset / 7;
    const indexEndOffset: number   = vertex_end_offset / 7;

    // 始点st1と終点ed1が同じなら、線端は追加せずに結合する
    if (stx1 === edx1 && sty1 === edy1) {
        meshAddLineJoinUseCase(
            edx2, edy2, stx1, sty1, stx2, sty2,
            indexEndOffset - 2, indexEndOffset - 1,
            indexBeginOffset, indexBeginOffset + 1
        );
        return;
    }

    // 始点の線端を追加する
    meshAddLineCapUseCase(
        stx1, sty1, stx2, sty2, 
        indexBeginOffset, indexBeginOffset + 1
    );

    // 終点の線端を追加する
    meshAddLineCapUseCase(
        edx1, edy1, edx2, edy2, 
        indexEndOffset - 1, indexEndOffset - 2
    );
};