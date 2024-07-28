import type {
    Easing,
    Tween
} from "@next2d/ui";

export interface UIImpl {
    Easing: typeof Easing;
    Tween: typeof Tween;
}