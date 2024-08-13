import { execute } from "./PathCommandArcUseCase";
import { describe, expect, it } from "vitest";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

describe("PathCommandArcUseCase.js method test", () =>
{
    it("test case", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;
        
        expect($currentPath.length).toBe(0);
        expect($vertices.length).toBe(0);

        execute(10, 10, 20);

        expect($currentPath.length).toBe(195);
        expect($vertices.length).toBe(0);

        expect($currentPath[0]).toBe(0);
        expect($currentPath[1]).toBe(0);
        expect($currentPath[2]).toBe(false);
        expect($currentPath[3]).toBe(5.625);
        expect($currentPath[4]).toBe(3.9460678100585938);
        expect($currentPath[5]).toBe(true);
        expect($currentPath[6]).toBe(9.496014595031738);
        expect($currentPath[7]).toBe(7.331478595733643);
        expect($currentPath[8]).toBe(false);
        expect($currentPath[9]).toBe(13.367029190063477);
        expect($currentPath[10]).toBe(10.716890335083008);
        expect($currentPath[11]).toBe(true);
        expect($currentPath[12]).toBe(15.772050857543945);
        expect($currentPath[13]).toBe(13.566152572631836);
        expect($currentPath[14]).toBe(false);
        expect($currentPath[15]).toBe(18.17707061767578);
        expect($currentPath[16]).toBe(16.415414810180664);
        expect($currentPath[17]).toBe(true);
        expect($currentPath[18]).toBe(19.260093688964844);
        expect($currentPath[19]).toBe(18.74078369140625);
        expect($currentPath[20]).toBe(false);
        expect($currentPath[21]).toBe(20.343116760253906);
        expect($currentPath[22]).toBe(21.06615447998047);
        expect($currentPath[23]).toBe(true);
        expect($currentPath[24]).toBe(20.392135620117188);
        expect($currentPath[25]).toBe(22.892135620117188);
        expect($currentPath[26]).toBe(false);
        expect($currentPath[27]).toBe(20.44115447998047);
        expect($currentPath[28]).toBe(24.718116760253906);
        expect($currentPath[29]).toBe(true);
        expect($currentPath[30]).toBe(19.60015869140625);
        expect($currentPath[31]).toBe(26.056968688964844);
        expect($currentPath[32]).toBe(false);
        expect($currentPath[33]).toBe(18.759164810180664);
        expect($currentPath[34]).toBe(27.39582061767578);
        expect($currentPath[35]).toBe(true);
        expect($currentPath[36]).toBe(17.316152572631836);
        expect($currentPath[37]).toBe(28.272050857543945);
        expect($currentPath[38]).toBe(false);
        expect($currentPath[39]).toBe(15.873140335083008);
        expect($currentPath[40]).toBe(29.148279190063477);
        expect($currentPath[41]).toBe(true);
        expect($currentPath[42]).toBe(13.972103118896484);
        expect($currentPath[43]).toBe(29.574138641357422);
        expect($currentPath[44]).toBe(false);
        expect($currentPath[45]).toBe(12.071067810058594);
        expect($currentPath[46]).toBe(30);
        expect($currentPath[47]).toBe(true);
        expect($currentPath[48]).toBe(10);
        expect($currentPath[49]).toBe(30);
        expect($currentPath[50]).toBe(false);
    });
});