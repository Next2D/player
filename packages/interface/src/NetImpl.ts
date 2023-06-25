import { URLRequest } from "../../net/src/URLRequest";
import { URLRequestHeader } from "../../net/src/URLRequestHeader";

export interface NetImpl {
    URLRequest: typeof URLRequest;
    URLRequestHeader: typeof URLRequestHeader;
}