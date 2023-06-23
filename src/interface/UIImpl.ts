import { Easing } from "../next2d/ui/Easing";
import { Job } from "../next2d/ui/Job";
import { Tween } from "../next2d/ui/Tween";

export interface UIImpl {
    Easing: typeof Easing;
    Job: typeof Job;
    Tween: typeof Tween;
}