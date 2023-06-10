import { URLRequestMethodImpl } from "./URLRequestMethodImpl";
import { URLLoaderDataFormatImpl } from "./URLLoaderDataFormatImpl";
import { URLRequestHeader } from "../player/next2d/net/URLRequestHeader";
import { AjaxEventImpl } from "./AjaxEventImpl";

export interface AjaxOptionImpl {
    url: string;
    format: URLLoaderDataFormatImpl;
    method: URLRequestMethodImpl;
    withCredentials: boolean;
    headers: URLRequestHeader[];
    data?: any;
    event?: AjaxEventImpl;
}