import { describe, expect, it } from "vitest";
import { encodeTextData, decodeTextData } from "./TextDataCodec";
import type { ITextDataCodecData } from "./TextDataCodec";
import { renderQueue } from "./RenderQueue";

const fixture = (): ITextDataCodecData => {
    const format = {
        font: "Arial", size: 16, color: 0xCC6600, bold: false, italic: false,
        underline: false, align: "left" as const, leftMargin: 0, rightMargin: 0,
        leading: 0, letterSpacing: 0
    };
    const object = {
        mode: "text" as const, text: "漢🙂é", x: 0, y: 16.25,
        w: 32.123456789, h: 20.5, line: 0, textFormat: format
    };
    return {
        textTable: [object, { ...object, textFormat: { ...format } }],
        lineTable: [{ ...object, mode: "wrap", text: "" }],
        ascentTable: [16.25], heightTable: [20.5], widthTable: [64.246913578]
    };
};

describe("renderer text wire codec", () => {
    it("accepts legacy object and null payloads, and rejects unknown array versions", () => {
        const data = fixture();
        expect(decodeTextData(JSON.stringify(data))).toEqual(data);
        expect(decodeTextData(encodeTextData(null))).toBeNull();
        expect(() => decodeTextData("[2,[],{}]")).toThrow("Unsupported renderer text data version");
    });

    it("preserves numeric JSON semantics, sparse entries and root attributes", () => {
        const data = Object.assign(fixture(), { _$textWidth: -1, _$textHeight: 20.5 });
        data.textTable[0].x = -0;
        data.textTable[0].textFormat.size = NaN;
        data.widthTable.push(Infinity);
        delete data.textTable[1];
        expect(decodeTextData(encodeTextData(data))).toEqual(JSON.parse(JSON.stringify(data)));
    });

    it("keeps Main format objects independent while compacting equal values", () => {
        const data = fixture();
        const first = data.textTable[0].textFormat;
        const second = data.textTable[1].textFormat;
        const wire = encodeTextData(data);
        expect(new TextEncoder().encode(wire).length).toBeLessThan(new TextEncoder().encode(JSON.stringify(data)).length);
        expect(data.textTable[0].textFormat).toBe(first);
        expect(data.textTable[1].textFormat).toBe(second);
        expect(first).not.toBe(second);
        first.underline = true;
        expect(second.underline).toBe(false);
        const restored = decodeTextData(encodeTextData(data))!;
        expect(restored.textTable[0].textFormat.underline).toBe(true);
        expect(restored.textTable[1].textFormat.underline).toBe(false);
    });

    it("round trips generated mixed formats without changing the input", () => {
        let seed = 20260909;
        const random = (n: number): number => {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            return seed % n;
        };
        const numbers = [0, -0, 1, -2, 0.1, 16, NaN, Infinity, null];
        for (let trial = 0; trial < 1000; trial++) {
            const data = fixture();
            data.textTable = Array.from({ length: random(40) }, (_, index) => {
                const object = fixture().textTable[0];
                object.text = ["A", "漢", "🙂", "é", "\n", "", "\ud83d", "\ude42"][random(8)];
                object.line = index % 5;
                object.textFormat.font = ["Arial", "Georgia", "bad'font", "", null][random(5)];
                object.textFormat.size = numbers[random(numbers.length)];
                object.textFormat.bold = random(3) ? false : null;
                object.textFormat.underline = Boolean(random(2));
                object.textFormat.color = random(0x1000000);
                return object;
            });
            const before = JSON.stringify(data);
            expect(decodeTextData(encodeTextData(data))).toEqual(JSON.parse(before));
            expect(JSON.stringify(data)).toBe(before);
        }
    });

    it("preserves UTF-8 byte lengths and following commands for every packed alignment", () => {
        const savedBuffer = renderQueue.buffer;
        const savedOffset = renderQueue.offset;
        const remainders = new Set<number>();
        try {
            for (let length = 0; length < 8; length++) {
                const data = fixture();
                data.textTable[0].text = "漢🙂" + "a".repeat(length);
                const bytes = new TextEncoder().encode(encodeTextData(data));
                remainders.add(bytes.length % 4);
                renderQueue.buffer = new Float32Array(8);
                renderQueue.offset = 0;
                renderQueue.push2(321, bytes.length);
                renderQueue.setUint8(bytes);
                renderQueue.push1(1234.5);
                const storage = new Float32Array(renderQueue.offset + 3);
                storage.set(renderQueue.buffer.subarray(0, renderQueue.offset), 3);
                const queue = storage.subarray(3);
                const payload = new Uint8Array(queue.buffer, queue.byteOffset + 8, queue[1]);
                expect(decodeTextData(new TextDecoder().decode(payload))).toEqual(data);
                expect(queue[2 + Math.ceil(bytes.length / 4)]).toBe(1234.5);
                expect(queue.length).toBe(3 + Math.ceil(bytes.length / 4));
            }
            expect([...remainders].sort()).toEqual([0, 1, 2, 3]);
        } finally {
            renderQueue.buffer = savedBuffer;
            renderQueue.offset = savedOffset;
        }
    });
});
