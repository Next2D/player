/**
 * @description 適応的ベジェ曲線テッセレーション
 *              Adaptive Bezier Curve Tessellation
 *
 * 三次ベジェ曲線を二次ベジェ曲線に変換する際、
 * フラットネス（平坦度）に基づいて動的に分割数を決定。
 *
 * - 単純な曲線: 2分割程度
 * - 複雑な曲線: 最大8分割
 *
 * これにより品質を維持しながら不要な計算を削減。
 */
/**
 * @description 三次ベジェ曲線を適応的に二次ベジェ曲線群に変換する関数
 *              Function to adaptively convert cubic bezier to quadratic bezier segments
 */
export {
    execute as adaptiveCubicToQuad
} from "./usecase/BezierConverterAdaptiveCubicToQuadUseCase";

/**
 * @description 二次ベジェ曲線セグメントのインターフェース
 *              Interface for quadratic bezier curve segment
 */
export type { IQuadraticSegment } from "../interface/IQuadraticSegment";
