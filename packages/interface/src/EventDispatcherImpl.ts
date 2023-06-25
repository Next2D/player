import { EventDispatcher } from "../../events/src/EventDispatcher";

export type EventDispatcherImpl<T extends EventDispatcher> = T;
