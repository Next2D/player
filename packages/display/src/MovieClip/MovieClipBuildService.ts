import type { DictionaryTagImpl } from "../interface/DictionaryTagImpl";
import type { ParentImpl } from "../interface/ParentImpl";
import type { MovieClipSoundObjectImpl } from "../interface/MovieClipSoundObjectImpl";
import type { MovieClipActionObjectImpl } from "../interface/MovieClipActionObjectImpl";
import type { MovieClipLabelObjectImpl } from "../interface/MovieClipLabelObjectImpl";
import type { LoaderInfoDataImpl } from "../interface/LoaderInfoDataImpl";
import { execute as displayObjectBaseBuildService } from "../DisplayObject/DisplayObjectBaseBuildService";
import { LoaderInfo } from "../LoaderInfo";
import { FrameLabel } from "../FrameLabel";
import { MovieClip } from "../MovieClip";
import { $getArray } from "../DisplayObjectUtil";
import { Sound, SoundMixer } from "@next2d/media";

/**
 * @description 指定tagの情報を元に、MovieClipを作成
 *              Create a MovieClip based on the specified tag information
 *
 * @param  {object} tag
 * @param  {DisplayObjectContainer} parent
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    tag: DictionaryTagImpl,
    parent: ParentImpl<any>
): Promise<MovieClip> => {

    const movieClip = new MovieClip();
    const character = displayObjectBaseBuildService(
        movieClip, tag, parent
    );

    if (character.sounds) {

        const loaderInfo = movieClip.loaderInfo as NonNullable<LoaderInfo>;
        const data = loaderInfo.data as NonNullable<LoaderInfoDataImpl>;

        for (let idx: number = 0; idx < character.sounds.length; ++idx) {

            const object: MovieClipSoundObjectImpl = character.sounds[idx];

            const sounds: Sound[] = $getArray();
            for (let idx: number = 0; idx < object.sound.length; ++idx) {

                const sound: Sound = new Sound();

                const tag = object.sound[idx];

                sound.loopCount = tag.loopCount | 0;
                sound.volume = Math.min(SoundMixer.volume, tag.volume);

                const character = data.characters[tag.characterId];
                await sound.build(character);

                sounds.push(sound);
            }

            movieClip._$sounds.set(object.frame, sounds);
        }
    }

    if (character.actions) {
        for (let idx: number = 0; idx < character.actions.length; ++idx) {

            const object: MovieClipActionObjectImpl = character.actions[idx];
            if (!object.script) {
                object.script = Function(object.action);
            }

            movieClip._$addAction(object.frame, object.script);
        }
    }

    if (character.labels) {
        for (let idx: number = 0; idx < character.labels.length; ++idx) {

            const label: MovieClipLabelObjectImpl = character.labels[idx];

            movieClip.addFrameLabel(new FrameLabel(label.name, label.frame));

        }
    }

    movieClip._$totalFrames = character.totalFrame || 1;

    return movieClip;
};