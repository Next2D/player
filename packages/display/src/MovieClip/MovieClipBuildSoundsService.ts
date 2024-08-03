import type { LoaderInfo } from "../LoaderInfo";
import type { MovieClip } from "../MovieClip";
import type { LoaderInfoDataImpl } from "../interface/LoaderInfoDataImpl";
import type { MovieClipSoundObjectImpl } from "../interface/MovieClipSoundObjectImpl";
import { $getArray } from "../DisplayObjectUtil";
import { Sound, SoundMixer } from "@next2d/media";

/**
 * @description 指定tagの情報を元に、MovieClipにサウンドを追加
 *              Add sound to MovieClip based on specified tag information
 *
 * @param  {MovieClip} movieClip
 * @param  {Map} sound_map
 * @param  {array} sound_objects
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    movie_clip: MovieClip,
    sound_map: Map<number, Sound[]>,
    sound_objects: MovieClipSoundObjectImpl[]
): Promise<void> => {

    const loaderInfo = movie_clip.loaderInfo as NonNullable<LoaderInfo>;
    const data = loaderInfo.data as NonNullable<LoaderInfoDataImpl>;

    for (let idx: number = 0; idx < sound_objects.length; ++idx) {

        const object = sound_objects[idx];
        if (!object) {
            continue;
        }

        const sounds: Sound[] = $getArray();
        for (let idx: number = 0; idx < object.sound.length; ++idx) {

            const tag = object.sound[idx];
            if (!tag) {
                continue;
            }

            const sound: Sound = new Sound();
            sound.loopCount = tag.loopCount | 0;
            sound.volume    = Math.min(SoundMixer.volume, tag.volume);

            const character = data.characters[tag.characterId];
            await sound._$build(character);

            sounds.push(sound);
        }

        sound_map.set(object.frame, sounds);
    }
};