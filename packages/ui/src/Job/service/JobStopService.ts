import type { Job } from "../../Job";
import { JobEvent } from "@next2d/events";

/**
 * @description ジョブの停止処理関数
 *              Stop process function
 *
 * @param  {Job} job
 * @return {void}
 * @method
 * @protected
 */
export const execute = (job: Job): void =>
{
    cancelAnimationFrame(job.$timerId);
    if (job.hasEventListener(JobEvent.STOP)) {
        job.dispatchEvent(new JobEvent(JobEvent.STOP));
    }
    job.entries  = null;
    job.stopFlag = true;
};