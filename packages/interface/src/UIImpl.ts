import { Easing } from "../../ui/src/Easing";
import { Job } from "../../ui/src/Job";
import { Tween } from "../../ui/src/Tween";

export interface UIImpl {
    Easing: typeof Easing;
    Job: typeof Job;
    Tween: typeof Tween;
}