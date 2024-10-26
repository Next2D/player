import { URLRequest } from "./URLRequest";
import { describe, expect, it } from "vitest";

describe("URLRequest.js properties test", () =>
{
    it("contentType case1", () =>
    {
        const urlRequest = new URLRequest();
        expect(urlRequest.contentType).toBe("application/json");
        urlRequest.contentType = "text/html; charset=utf-8";
        expect(urlRequest.contentType).toBe("text/html; charset=utf-8");
    });

    it("data test case1", () =>
    {
        const urlRequest = new URLRequest();
        expect(urlRequest.data).toBe(null);
        urlRequest.data = "data";
        expect(urlRequest.data).toBe("data");
    });

    it("data test case2", () =>
    {
        const urlRequest = new URLRequest();
        expect(urlRequest.data).toBe(null);
        urlRequest.data = 0;
        expect(urlRequest.data).toBe(0);
    });

    it("method test case1", () =>
    {
        const urlRequest = new URLRequest();
        expect(urlRequest.method).toBe("GET");
        urlRequest.method = "POST";
        expect(urlRequest.method).toBe("POST");
    });

    it("requestHeaders test case1", () =>
    {
        const urlRequest = new URLRequest();
        expect(urlRequest.requestHeaders.length).toBe(0);

        urlRequest.requestHeaders = [{
            "name": "test",
            "value": "aaa"
        }];

        expect(urlRequest.requestHeaders.length).toBe(1);
        for (let i = 0; urlRequest.requestHeaders.length > i; i++) {
            const requestHeader = urlRequest.requestHeaders[i];
            expect(requestHeader.name).toBe("test");
            expect(requestHeader.value).toBe("aaa");
        }
    });

    it("url test case1", () =>
    {
        const urlRequest = new URLRequest();
        expect(urlRequest.url).toBe("");
        urlRequest.url = "http://test.com";
        expect(urlRequest.url).toBe("http://test.com");
    });

});
