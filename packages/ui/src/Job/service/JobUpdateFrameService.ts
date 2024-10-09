import type { IEntriesObject } from "../../interface/IEntriesObject";
import type { Job } from "../../Job";
import { execute as jobUpdatePropertyService } from "./JobUpdatePropertyService";
import { JobEvent } from "@next2d/events";

/**
 * @description 繰り返しのアップデート処理関数
 *              Update process function
 *
 * @param  {Job} job
 * @param  {number} timestamp
 * @return {array}
 * @method
 * @private
 */
export const execute = (job: Job, timestamp: number): number =>
{
    if (job.stopFlag) {
        return -1;
    }

    // update current time
    job.currentTime = (timestamp - job.startTime) / 1000;

    // update property
    jobUpdatePropertyService(
        job, job.target,
        job.from, job.to,
        job.entries as IEntriesObject[]
    );

    // update event
    if (job.hasEventListener(JobEvent.UPDATE)) {
        job.dispatchEvent(new JobEvent(JobEvent.UPDATE));
    }

    // complete logic
    if (job.currentTime >= job.duration) {

        // complete event
        if (job.hasEventListener(JobEvent.COMPLETE)) {
            job.dispatchEvent(new JobEvent(JobEvent.COMPLETE));
        }

        // next job
        if (job.nextJob) {
            job.nextJob.start();
        }

        return -1;
    }

    return requestAnimationFrame((timestamp: number): void =>
    {
        execute(job, timestamp);
    });
};