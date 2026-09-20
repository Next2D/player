interface ITextDataCodecFormat {
    font: string | null;
    size: number | null;
    color: number | null;
    bold: boolean | null;
    italic: boolean | null;
    underline: boolean | null;
    align: "center" | "left" | "right" | null;
    leftMargin: number | null;
    rightMargin: number | null;
    leading: number | null;
    letterSpacing: number | null;
}

interface ITextDataCodecObject {
    mode: "break" | "wrap" | "image" | "text";
    text: string;
    x: number;
    y: number;
    w: number;
    h: number;
    line: number;
    textFormat: ITextDataCodecFormat;
}

export interface ITextDataCodecData {
    textTable: ITextDataCodecObject[];
    lineTable: ITextDataCodecObject[];
    ascentTable: number[];
    heightTable: number[];
    widthTable: number[];
}

type ITextDataTuple = [ITextDataCodecObject["mode"], string, number, number, number, number, number, number];
type ITextDataPacked = Omit<ITextDataCodecData, "textTable" | "lineTable"> & {
    textTable: ITextDataTuple[];
    lineTable: ITextDataTuple[];
};
type ITextDataWire = [number, ITextDataCodecFormat[], ITextDataPacked];

/** Encode renderer text values without changing Main's independently editable formats. */
export const encodeTextData = (data: ITextDataCodecData | null): string =>
{
    if (!data) {
        return "null";
    }

    const formats: ITextDataCodecFormat[] = [];
    let previous: ITextDataCodecFormat | null = null;
    const encode = (object: ITextDataCodecObject): ITextDataTuple => {
        // JSON converts sparse array entries to null; preserve that existing behavior.
        if (!object) {
            return object;
        }
        const format = object.textFormat;
        if (!previous
            || previous.font !== format.font || previous.size !== format.size
            || previous.color !== format.color || previous.bold !== format.bold
            || previous.italic !== format.italic || previous.underline !== format.underline
            || previous.align !== format.align || previous.leftMargin !== format.leftMargin
            || previous.rightMargin !== format.rightMargin || previous.leading !== format.leading
            || previous.letterSpacing !== format.letterSpacing
        ) {
            formats.push(format);
            previous = format;
        }
        return [object.mode, object.text, object.x, object.y, object.w, object.h, object.line, formats.length - 1];
    };

    const packed: ITextDataPacked = {
        ...data,
        "textTable": data.textTable.map(encode),
        "lineTable": data.lineTable.map(encode)
    };
    const wire: ITextDataWire = [1, formats, packed];
    return JSON.stringify(wire);
};

/** Decode the internal versioned wire format, also accepting legacy object/null JSON. */
export const decodeTextData = (json: string): ITextDataCodecData | null =>
{
    const value: unknown = JSON.parse(json);
    if (!Array.isArray(value)) {
        return value as ITextDataCodecData | null;
    }
    const [version, formats, packed] = value as ITextDataWire;
    if (version !== 1) {
        throw new Error("Unsupported renderer text data version.");
    }
    const decode = (values: ITextDataTuple): ITextDataCodecObject => {
        if (!values) {
            return values;
        }
        return {
            "mode": values[0], "text": values[1],
            "x": values[2], "y": values[3], "w": values[4], "h": values[5],
            "line": values[6], "textFormat": formats[values[7]]
        };
    };
    return {
        ...packed,
        "textTable": packed.textTable.map(decode),
        "lineTable": packed.lineTable.map(decode)
    };
};
