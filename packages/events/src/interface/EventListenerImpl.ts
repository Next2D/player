import type { EventDispatcherImpl } from "./EventDispatcherImpl";

export interface EventListenerImpl {
    listener: Function;
    priority: number;
    useCapture: boolean;
    target: EventDispatcherImpl<any>;
}