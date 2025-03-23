import type {
    Easing,
    Tween
} from "@next2d/ui";

export interface IUI {
    Easing: typeof Easing;
    Tween: typeof Tween;
}