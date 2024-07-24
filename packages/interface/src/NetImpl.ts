import { URLRequest } from "@next2d/net";

export interface NetImpl {
    URLRequest: typeof URLRequest;
}