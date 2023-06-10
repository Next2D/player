import { Easing } from "../player/next2d/ui/Easing";
import { Job } from "../player/next2d/ui/Job";
import { Tween } from "../player/next2d/ui/Tween";

export interface UIImpl {
    Easing: typeof Easing;
    Job: typeof Job;
    Tween: typeof Tween;
}