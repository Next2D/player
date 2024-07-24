import { EventImpl } from "../interface/EventImpl";

/**
 * @description toString() メソッドを実装するためのユーティリティ関数
 *              Utility functions to implement the toString() method
 *
 * @param  {Event} event
 * @param  {array} args
 * @return {string}
 * @method
 * @protected
 */
export const execute = (event: EventImpl<any>, ...args: string[]): string =>
{
    let str = `[${args[0]}`;
    for (let idx = 1; idx < args.length; ++idx) {

        const name = args[idx];
        if (!(name in event)) {
            continue;
        }

        str += ` ${name}=`;

        const value = event[name];
        str += typeof value === "string"
            ? `"${value}"`
            : `${value}`;
    }
    return `${str}]`;
};