import type { IURLRequestMethod } from "./IURLRequestMethod";
import type { IURLLoaderDataFormat } from "./IURLLoaderDataFormat";
import type { IAjaxEvent } from "./IAjaxEvent";
import type { IURLRequestHeader } from "./IURLRequestHeader";

export interface IAjaxOption {
    url: string;
    format: IURLLoaderDataFormat;
    method: IURLRequestMethod;
    withCredentials: boolean;
    headers: IURLRequestHeader[];
    data?: any;
    event?: IAjaxEvent;
}