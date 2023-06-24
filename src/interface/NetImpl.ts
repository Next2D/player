import { URLRequest } from "../next2d/net/URLRequest";
import { URLRequestHeader } from "../next2d/net/URLRequestHeader";

export interface NetImpl {
    URLRequest: typeof URLRequest;
    URLRequestHeader: typeof URLRequestHeader;
}