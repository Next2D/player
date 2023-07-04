import { EventsImpl } from "@next2d/interface";
import {
    Event,
    EventDispatcher,
    EventPhase,
    FocusEvent,
    HTTPStatusEvent,
    IOErrorEvent,
    MouseEvent,
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
    MouseEvent,
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