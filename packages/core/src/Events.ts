import type { EventsImpl } from "./interface/EventsImpl";
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

const events: EventsImpl = {
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