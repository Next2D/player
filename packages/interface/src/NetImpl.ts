import {
    URLRequest,
    URLRequestHeader
} from "@next2d/net";

export interface NetImpl {
    URLRequest: typeof URLRequest;
    URLRequestHeader: typeof URLRequestHeader;
}