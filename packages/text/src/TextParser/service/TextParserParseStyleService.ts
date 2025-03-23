import type { IAttributeObject } from "../../interface/IAttributeObject";

/**
 * @description スタイルを解析して属性オブジェクトの配列を返す
 *              Analyze the style and return an array of attribute objects
 *
 * @param  {string} value
 * @return {IAttributeObject[]}
 * @method
 * @protected
 */
export const execute = (value: string): IAttributeObject[] =>
{
    const values: string[] = value
        .trim()
        .split(";");

    const attributes: IAttributeObject[] = [];
    for (let idx = 0; idx < values.length; ++idx) {

        const styleValue = values[idx];
        if (!styleValue) {
            continue;
        }

        const styles = styleValue.split(":");
        const name   = styles[0].trim();
        const value  = styles[1].trim();
        switch (name) {

            case "font-size":
                attributes.push({
                    "name": "size",
                    "value": parseInt(value)
                });
                break;

            case "font-family":
                attributes.push({
                    "name": "face",
                    "value": value.replace(/'|"/g, "")
                });
                break;

            case "letter-spacing":
                attributes.push({
                    "name": "letterSpacing",
                    "value": parseInt(value)
                });
                break;

            case "margin-bottom":
                attributes.push({
                    "name": "leading",
                    "value": parseInt(value)
                });
                break;

            case "margin-left":
                attributes.push({
                    "name": "leftMargin",
                    "value": parseInt(value)
                });
                break;

            case "margin-right":
                attributes.push({
                    "name": "rightMargin",
                    "value": parseInt(value)
                });
                break;

            case "color":
            case "align":
                attributes.push({
                    "name": name,
                    "value": value
                });
                break;

            case "text-decoration":
            case "font-weight":
            case "font-style":
                attributes.push({
                    "name": value,
                    "value": true
                });
                break;

            default:
                break;

        }
    }

    return attributes;
};