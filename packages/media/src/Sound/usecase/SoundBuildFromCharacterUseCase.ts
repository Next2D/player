import type { ISoundCharacter } from "../../interface/ISoundCharacter";
import type { Sound } from "../../Sound";
import { execute as soundDecodeService } from "../service/SoundDecodeService";

/**
 * @description キャラクターからSoundを構築
 *              Build Sound from character
 *
 * @param  {Sound} sound
 * @param  {ISoundCharacter} character
 * @return {Promise<void>}
 * @method
 * @protected
 */
export const execute = async (sound: Sound, character: ISoundCharacter): Promise<void> =>
{
    // load AudioBuffer
    if (!character.audioBuffer) {
        const uint8Array  = new Uint8Array(character.buffer as number[]);
        const audioBuffer = await soundDecodeService(uint8Array.buffer);
        if (!audioBuffer) {
            return ;
        }
        character.audioBuffer = audioBuffer;
    }

    sound.audioBuffer = character.audioBuffer;
};