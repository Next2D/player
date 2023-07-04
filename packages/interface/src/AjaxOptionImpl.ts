import { URLRequestMethodImpl } from "./URLRequestMethodImpl";
import { URLLoaderDataFormatImpl } from "./URLLoaderDataFormatImpl";
import { AjaxEventImpl } from "./AjaxEventImpl";
import { URLRequestHeader } from "@next2d/net";

export interface AjaxOptionImpl {
    url: string;
    format: URLLoaderDataFormatImpl;
    method: URLRequestMethodImpl;
    withCredentials: boolean;
    headers: URLRequestHeader[];
    data?: any;
    event?: AjaxEventImpl;
}