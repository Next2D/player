import type { LoaderInfo } from "../next2d/display/LoaderInfo";

/**
 * @type {number}
 */
let instanceId: number = 0;

/**
 * @return {number}
 * @method
 * @public
 */
export const $getInstanceId = (): number =>
{
    return instanceId++;
};

/**
 * @type {number}
 */
let loaderInfoId: number = 0;

/**
 * @return {number}
 * @method
 * @public
 */
export const $getLoaderInfoId = (): number =>
{
    return loaderInfoId++;
};

/**
 * @type {LoaderInfo | null}
 * @public
 */
let $currentLoaderInfo: LoaderInfo | null = null;

export const $getCurrentLoaderInfo = (): LoaderInfo | null =>
{
    return $currentLoaderInfo;
};

export const $setCurrentLoaderInfo = (loader_info: LoaderInfo | null = null) =>
{
    $currentLoaderInfo = loader_info;
};

let $eventType: string = "";

export const $getEventType = (): string =>
{
    return $eventType;
};

export const $setEventType = (event_type: string) =>
{
    $eventType = event_type;
};

/**
 * @type {Event | null}
 * @public
 */
let $event: MouseEvent | TouchEvent | Event | null = null;

export const $getEvent = (): MouseEvent | TouchEvent | Event | null =>
{
    return $event;
};

export const $setEvent = (event: MouseEvent | TouchEvent | Event | null = null) =>
{
    $event = event;
};

let $updated: boolean = false;

export const $isUpdated = (): boolean =>
{
    return $updated;
};

export const $doUpdated = (update: boolean = true) =>
{
    $updated = update;
};

let $soundMixerVolume: number = 1;

export const $getSoundMixerVolume = (): number =>
{
    return $soundMixerVolume;
};

export const $setSoundMixerVolume = (volume: number) =>
{
    $soundMixerVolume = volume;
};