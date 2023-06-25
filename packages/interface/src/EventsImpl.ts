import { Event } from "../../events/src/Event";
import { EventDispatcher } from "../../events/src/EventDispatcher";
import { EventPhase } from "../../events/src/EventPhase";
import { FocusEvent } from "../../events/src/FocusEvent";
import { HTTPStatusEvent } from "../../events/src/HTTPStatusEvent";
import { IOErrorEvent } from "../../events/src/IOErrorEvent";
import { MouseEvent } from "../../events/src/MouseEvent";
import { ProgressEvent } from "../../events/src/ProgressEvent";
import { VideoEvent } from "../../events/src/VideoEvent";

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