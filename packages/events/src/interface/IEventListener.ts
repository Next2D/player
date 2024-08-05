import type { IEventDispatcher } from "./IEventDispatcher";

export interface IEventListener {
    listener: Function;
    priority: number;
    useCapture: boolean;
    target: IEventDispatcher<any>;
}