import type {
    Event,
    EventDispatcher,
    EventPhase,
    FocusEvent,
    GamepadEvent,
    HTTPStatusEvent,
    IOErrorEvent,
    PointerEvent,
    JobEvent,
    ProgressEvent,
    VideoEvent
} from "@next2d/events";

export interface IEvents {
    Event: typeof Event;
    EventDispatcher: typeof EventDispatcher;
    EventPhase: typeof EventPhase;
    FocusEvent: typeof FocusEvent;
    GamepadEvent: typeof GamepadEvent;
    HTTPStatusEvent: typeof HTTPStatusEvent;
    IOErrorEvent: typeof IOErrorEvent;
    PointerEvent: typeof PointerEvent;
    JobEvent: typeof JobEvent;
    ProgressEvent: typeof ProgressEvent;
    VideoEvent: typeof VideoEvent;
}