import { Event } from "../player/next2d/events/Event";
import { EventDispatcher } from "../player/next2d/events/EventDispatcher";
import { EventPhase } from "../player/next2d/events/EventPhase";
import { FocusEvent } from "../player/next2d/events/FocusEvent";
import { HTTPStatusEvent } from "../player/next2d/events/HTTPStatusEvent";
import { IOErrorEvent } from "../player/next2d/events/IOErrorEvent";
import { MouseEvent } from "../player/next2d/events/MouseEvent";
import { ProgressEvent } from "../player/next2d/events/ProgressEvent";
import { VideoEvent } from "../player/next2d/events/VideoEvent";

export interface EventsImpl {
    Event: typeof Event;
    EventDispatcher: typeof EventDispatcher;
    EventPhase: typeof EventPhase;
    FocusEvent: typeof FocusEvent;
    HTTPStatusEvent: typeof HTTPStatusEvent;
    IOErrorEvent: typeof IOErrorEvent;
    MouseEvent: typeof MouseEvent;
    ProgressEvent: typeof ProgressEvent;
    VideoEvent: typeof VideoEvent;
}