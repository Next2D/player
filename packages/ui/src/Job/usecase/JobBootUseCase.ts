import type { Job } from "../../Job";
import { execute as jobEntriesService } from "../service/JobEntriesService";
import { execute as jobUpdateFrameService } from "../service/JobUpdateFrameService";

/**
 * @description ジョブの実行処理関数
 *              Execution process function
 *
 * @param {Job} job
 * @return {void}
 * @method
 * @protected
 */
export const execute = (job: Job): void =>
{
    if (job.stopFlag) {
        return ;
    }

    // create entries
    job.entries = jobEntriesService(job.from);
    if (!job.entries) {
        return ;
    }

    // setup
    job.startTime = performance.now();

    // start
    job.$timerId = jobUpdateFrameService(job, job.startTime);
};