describe("CacheStore.js packages test", function()
{

    it("destroy test canvas", function()
    {
        const cs = new CacheStore();
        expect(cs._$pool.length).toBe(0);
    });

});