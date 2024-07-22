import { EventDispatcher } from "../EventDispatcher";

export type EventDispatcherImpl<T extends EventDispatcher> = T;
