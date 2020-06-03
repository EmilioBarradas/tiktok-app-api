import { User, Video, Audio, Tag } from './types/core';
import { TYPE_RECENT_VIDEOS, TYPE_LIKED_VIDEOS, TYPE_TAG_VIDEOS, TYPE_AUDIO_VIDEOS, TYPE_TRENDING_VIDEOS } from './constants';
import { IllegalArgument } from './errors/IllegalArgument';

export function getTrendingContentURL() {
    return 'https://m.tiktok.com/api/item_list/?count=30&id=1&type='
            + TYPE_TRENDING_VIDEOS + '&secUid=&maxCursor=0&minCursor=0&sourceType=12&appId=1233';
}

export function getUserInfoContentURL(identifier: User | string): string {
    if (typeof identifier === 'string') {
        return 'https://m.tiktok.com/api/user/detail/?uniqueId=' + identifier;
    }

    if (typeof identifier.username === 'undefined') {
        throw new IllegalArgument("Passed User must have a username set.");
    }

    return 'https://m.tiktok.com/api/user/detail/?uniqueId=' + identifier.username;
}

export function getRecentVideosContentURL(user: User, count: number, startCur: string): string {
    if (typeof user.id === 'undefined') {
        throw new IllegalArgument("Passed User must have an id set.");
    }

    return 'https://m.tiktok.com/api/item_list/?count=' + count + '&id=' + user.id + '&type=' 
            + TYPE_RECENT_VIDEOS + '&secUid=&maxCursor=' + startCur + '&minCursor=0&sourceType=8&appId=1233';
}

export function getLikedVideosContentURL(user: User): string {
    if (typeof user.id === 'undefined') {
        throw new IllegalArgument("Passed User must have an id set.");
    }

    return 'https://m.tiktok.com/api/item_list/?count=30&id=' + user.id 
            + '&type=' + TYPE_LIKED_VIDEOS + '&secUid=&maxCursor=0&minCursor=0&sourceType=9&appId=1233';
}

export function getVideoInfoContentURL(video: Video): string {
    if (typeof video.id === 'undefined') {
        throw new IllegalArgument("Passed Video must have an id set.");
    }

    return 'https://m.tiktok.com/api/item/detail/?itemId=' + video.id;
}

export function getAudioInfoContentURL(audio: Audio): string {
    if (typeof audio.id === 'undefined') {
        throw new IllegalArgument("Passed Audio must have an id set.");
    }

    return 'https://m.tiktok.com/api/music/detail/?musicId=' + audio.id
            + '&language=en';
}

export function getAudioTopContentURL(audio: Audio): string {
    if (typeof audio.id === 'undefined') {
        throw new IllegalArgument("Passed Audio must have an id set.");
    }

    return 'https://m.tiktok.com/share/item/list?secUid=&id=' + audio.id 
            + '&type=' + TYPE_AUDIO_VIDEOS + '&count=30&minCursor=0&maxCursor=0&shareUid=';
}

export function getTagInfoContentURL(identifier: Tag | string): string {
    if (typeof identifier === 'string') {
        return 'https://m.tiktok.com/api/challenge/detail/?challengeName=' + identifier
                + '&language=en';
    }

    if (typeof identifier.title === 'undefined') {
        throw new IllegalArgument("Passed Tag must have a title set.");
    }

    return 'https://m.tiktok.com/api/challenge/detail/?challengeName=' + identifier.title
            + '&language=en';
}

export function getTagTopContentURL(tag: Tag): string {
    if (typeof tag.id === 'undefined') {
        throw new IllegalArgument("Passed Tag must have an id set.");
    }

    return 'https://m.tiktok.com/share/item/list?secUid=&id=' + tag.id
            + '&type=' + TYPE_TAG_VIDEOS + '&count=30&minCursor=0&maxCursor=0&shareUid=';
}