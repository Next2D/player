import type { IEvents } from "./interface/IEvents";
import {
    Event,
    EventDispatcher,
    EventPhase,
    FocusEvent,
    HTTPStatusEvent,
    IOErrorEvent,
    PointerEvent,
    JobEvent,
    ProgressEvent,
    VideoEvent
} from "@next2d/events";

const events: IEvents = {
    Event,
    EventDispatcher,
    EventPhase,
    FocusEvent,
    HTTPStatusEvent,
    IOErrorEvent,
    PointerEvent,
    JobEvent,
    ProgressEvent,
    VideoEvent
};

Object.entries(events).forEach(([key, EventClass]) =>
{
    Object.defineProperty(events, key, {
        get()
        {
            return EventClass;
        }
    });
});

export { events };