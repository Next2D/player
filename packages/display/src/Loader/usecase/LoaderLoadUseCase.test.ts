import { URLRequest } from "@next2d/net";
import { Loader } from "../../Loader";
import { describe, expect, it, beforeEach } from "vitest";

describe("LoaderLoadUseCase.js test", () =>
{
    let loader: Loader;

    beforeEach(() =>
    {
        loader = new Loader();
    });

    it("execute test case1 - creates URLRequest with URL", () =>
    {
        const request = new URLRequest("https://example.com/data.json");
        
        expect(request.url).toBe("https://example.com/data.json");
        expect(request.method).toBe("GET");
        expect(request.responseDataFormat).toBe("json");
    });

    it("execute test case2 - creates URLRequest with default values", () =>
    {
        const request = new URLRequest();
        
        expect(request.url).toBe("");
        expect(request.method).toBe("GET");
        expect(request.responseDataFormat).toBe("json");
        expect(request.contentType).toBe("application/json");
        expect(request.data).toBeNull();
        expect(request.withCredentials).toBe(false);
    });

    it("execute test case3 - POST request configuration", () =>
    {
        const request = new URLRequest("https://example.com/api/submit");
        request.method = "POST";
        request.data = { key: "value" };

        expect(request.method).toBe("POST");
        expect(request.data).toEqual({ key: "value" });
        expect(request.url).toBe("https://example.com/api/submit");
    });

    it("execute test case4 - request with custom headers", () =>
    {
        const request = new URLRequest("https://example.com/data.json");
        request.requestHeaders = [
            { name: "Authorization", value: "Bearer token123" },
            { name: "Custom-Header", value: "custom-value" }
        ];

        expect(request.requestHeaders).toHaveLength(2);
        expect(request.requestHeaders[0]).toEqual({ name: "Authorization", value: "Bearer token123" });
        expect(request.requestHeaders[1]).toEqual({ name: "Custom-Header", value: "custom-value" });
    });

    it("execute test case5 - request with credentials", () =>
    {
        const request = new URLRequest("https://example.com/secure/data.json");
        request.withCredentials = true;

        expect(request.withCredentials).toBe(true);
        expect(request.url).toBe("https://example.com/secure/data.json");
    });

    it("execute test case6 - different response data formats", () =>
    {
        const request = new URLRequest("https://example.com/data");
        request.responseDataFormat = "text";

        expect(request.responseDataFormat).toBe("text");
    });

    it("execute test case7 - loader initial state", () =>
    {
        expect(loader.content).toBeNull();
        expect(loader.contentLoaderInfo).toBeDefined();
    });

    it("execute test case8 - URLRequest with empty string", () =>
    {
        const request = new URLRequest("");

        expect(request.url).toBe("");
        expect(request.method).toBe("GET");
    });

    it("execute test case9 - URLRequest properties can be modified", () =>
    {
        const request = new URLRequest("https://example.com/initial.json");
        
        expect(request.url).toBe("https://example.com/initial.json");
        
        request.url = "https://example.com/modified.json";
        request.method = "PUT";
        request.contentType = "application/xml";
        
        expect(request.url).toBe("https://example.com/modified.json");
        expect(request.method).toBe("PUT");
        expect(request.contentType).toBe("application/xml");
    });

    it("execute test case10 - multiple header configurations", () =>
    {
        const request = new URLRequest("https://api.example.com/data");
        
        expect(request.requestHeaders).toEqual([]);
        
        request.requestHeaders.push({ name: "Accept", value: "application/json" });
        request.requestHeaders.push({ name: "Content-Type", value: "application/json" });
        request.requestHeaders.push({ name: "X-Custom", value: "test" });
        
        expect(request.requestHeaders).toHaveLength(3);
        expect(request.requestHeaders[2]).toEqual({ name: "X-Custom", value: "test" });
    });
});
