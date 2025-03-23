import type { Job } from "../../Job";
import { execute as jobBootUseCase } from "./JobBootUseCase";

/**
 * @description ジョブの開始処理関数
 *              Start process function
 *
 * @param  {Job} job
 * @return {void}
 * @method
 * @protected
 */
export const execute = (job: Job): void =>
{
    // stop job
    cancelAnimationFrame(job.$timerId);

    // reset
    job.stopFlag = false;

    // delayed start
    if (job.delay) {
        setTimeout(() =>
        {
            jobBootUseCase(job);
        }, job.delay * 1000);
    } else {
        jobBootUseCase(job);
    }
};