import type { EntriesObjectImpl } from "../interface/EntriesObjectImpl";
import type { ObjectImpl } from "../interface/ObjectImpl";
import type { Job } from "../Job";

/**
 * @description fromのオブジェクトのプロパティを元に、targetのプロパティの値を更新
 *              Update the value of the target property based on the properties of the from object
 *
 * @param  {Job} job
 * @param  {object} target
 * @param  {object} from
 * @param  {object} to
 * @param  {array} entries
 * @return {void}
 * @method
 * @private
 */
export const execute = (
    job: Job,
    target: any,
    from: ObjectImpl,
    to: ObjectImpl,
    entries: EntriesObjectImpl[]
): void => {

    for (let idx = 0; idx < entries.length; ++idx) {

        const entry = entries[idx];
        if (!entry) {
            continue;
        }

        const name = entry.name;
        if (!(name in target) || !(name in to)) {
            continue;
        }

        if (typeof entry.value !== "number") {
            execute(
                job,
                target[name],
                from[name] as ObjectImpl,
                to[name] as ObjectImpl,
                entry.value as EntriesObjectImpl[]
            );
            continue;
        }

        // update
        const fromValue = from[name] as number;
        if (job.duration > job.currentTime) {

            target[name] = job.ease(
                job.currentTime,
                fromValue, to[name] as number - fromValue,
                job.duration
            );

        } else {

            // Easing end
            target[name] = to[name] as number;

        }
    }
};