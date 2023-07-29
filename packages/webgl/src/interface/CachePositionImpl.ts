export interface CachePositionImpl {
    index: number;
    x: number;
    y: number;
    w: number;
    h: number;
    filterState?: boolean;
    matrix?: string;
    offsetX?: number;
    offsetY?: number;
}