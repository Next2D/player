import {
    Easing,
    Job,
    Tween
} from "@next2d/ui";

export interface UIImpl {
    Easing: typeof Easing;
    Job: typeof Job;
    Tween: typeof Tween;
}