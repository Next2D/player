import { URLRequest } from "../player/next2d/net/URLRequest";
import { URLRequestHeader } from "../player/next2d/net/URLRequestHeader";

export interface NetImpl {
    URLRequest: typeof URLRequest;
    URLRequestHeader: typeof URLRequestHeader;
}