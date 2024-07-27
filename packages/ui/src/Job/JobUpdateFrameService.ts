import type { EntriesObjectImpl } from "../interface/EntriesObjectImpl";
import type { Job } from "../Job";
import { execute as jobUpdatePropertyService } from "./JobUpdatePropertyService";
import { Event } from "@next2d/events";

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
    job.currentTime = (timestamp - job.startTime) * 0.001;

    // update property
    jobUpdatePropertyService(
        job, job.target,
        job.from, job.to,
        job.entries as EntriesObjectImpl[]
    );

    // update event
    if (job.hasEventListener(Event.UPDATE)) {
        job.dispatchEvent(new Event(Event.UPDATE));
    }

    // complete logic
    if (job.currentTime >= job.duration) {

        // complete event
        if (job.hasEventListener(Event.COMPLETE)) {
            job.dispatchEvent(new Event(Event.COMPLETE));
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