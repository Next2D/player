import type { URLRequestMethodImpl } from "./URLRequestMethodImpl";
import type { URLLoaderDataFormatImpl } from "./URLLoaderDataFormatImpl";
import type { AjaxEventImpl } from "./AjaxEventImpl";
import type { URLRequestHeaderImpl } from "./URLRequestHeaderImpl";

export interface AjaxOptionImpl {
    url: string;
    format: URLLoaderDataFormatImpl;
    method: URLRequestMethodImpl;
    withCredentials: boolean;
    headers: URLRequestHeaderImpl[];
    data?: any;
    event?: AjaxEventImpl;
}