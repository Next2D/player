import { Event } from "../next2d/events/Event";
import { EventDispatcher } from "../next2d/events/EventDispatcher";
import { EventPhase } from "../next2d/events/EventPhase";
import { FocusEvent } from "../next2d/events/FocusEvent";
import { HTTPStatusEvent } from "../next2d/events/HTTPStatusEvent";
import { IOErrorEvent } from "../next2d/events/IOErrorEvent";
import { MouseEvent } from "../next2d/events/MouseEvent";
import { ProgressEvent } from "../next2d/events/ProgressEvent";
import { VideoEvent } from "../next2d/events/VideoEvent";
import type { EventsImpl } from "../interface/EventsImpl";

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