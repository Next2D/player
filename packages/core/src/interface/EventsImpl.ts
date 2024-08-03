import type {
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

export interface EventsImpl {
    Event: typeof Event;
    EventDispatcher: typeof EventDispatcher;
    EventPhase: typeof EventPhase;
    FocusEvent: typeof FocusEvent;
    HTTPStatusEvent: typeof HTTPStatusEvent;
    IOErrorEvent: typeof IOErrorEvent;
    PointerEvent: typeof PointerEvent;
    JobEvent: typeof JobEvent;
    ProgressEvent: typeof ProgressEvent;
    VideoEvent: typeof VideoEvent;
}