import { User, Video, Audio, Tag } from './types/core';
import { TYPE_RECENT_VIDEOS, TYPE_LIKED_VIDEOS, TYPE_TRENDING_VIDEOS } from './constants';
import { IllegalArgument } from './errors/IllegalArgument';

export function getTrendingContentURL(count: number, startCur: string) {
    return 'https://m.tiktok.com/api/item_list/?user_agent=&minCursor=0'
         + `&maxCursor=${startCur}&count=${count}&sourceType=${TYPE_TRENDING_VIDEOS}`;
}

export function getUserInfoContentURL(identifier: User | string): string {
    let uniqueId = typeof identifier === 'string' ? identifier : identifier.username;

    if (typeof uniqueId === 'undefined') {
        throw new IllegalArgument("Passed User must have a username set.");
    }

    return `https://www.tiktok.com/node/share/user/@${uniqueId}?user_agent=`;
}

export function getRecentVideosContentURL(user: User, count: number, startCur: string): string {
    if (typeof user.id === 'undefined') {
        throw new IllegalArgument("Passed User must have an id set.");
    }

    return 'https://m.tiktok.com/api/item_list/?user_agent=&minCursor=0'
         + `&maxCursor=${startCur}&id=${user.id}&count=${count}&sourceType=${TYPE_RECENT_VIDEOS}`;
}

export function getLikedVideosContentURL(user: User, count: number, startCur: string): string {
    if (typeof user.id === 'undefined') {
        throw new IllegalArgument("Passed User must have an id set.");
    }

    return 'https://m.tiktok.com/api/item_list/?user_agent=&minCursor=0'
         + `&maxCursor=${startCur}&id=${user.id}&count=${count}&sourceType=${TYPE_LIKED_VIDEOS}`;
}

export function getVideoInfoContentURL(video: Video): string {
    if (typeof video.id === 'undefined') {
        throw new IllegalArgument("Passed Video must have an id set.");
    }

    return `https://m.tiktok.com/api/item/detail/?agent_user=&itemId=${video.id}`;
}

export function getAudioInfoContentURL(audio: Audio): string {
    if (typeof audio.id === 'undefined') {
        throw new IllegalArgument("Passed Audio must have an id set.");
    }

    return `https://m.tiktok.com/api/music/detail/?agent_user=&musicId=${audio.id}&language=en`;
}

export function getAudioTopContentURL(audio: Audio, count: number, startCur: string): string {
    if (typeof audio.id === 'undefined') {
        throw new IllegalArgument("Passed Audio must have an id set.");
    }

    return `https://m.tiktok.com/api/music/item_list/?aid=1988&musicID=${audio.id}&count=${count}&cursor=${startCur}`;
}

export function getTagInfoContentURL(identifier: Tag | string): string {
    let uniqueId = typeof identifier === 'string' ? identifier : identifier.id;

    if (typeof uniqueId === 'undefined') {
        throw new IllegalArgument("Passed Tag must have an id set.");
    }

    return `https://m.tiktok.com/api/challenge/detail/?agent_user=&challengeId=${uniqueId}`;
}

export function getTagTopContentURL(tag: Tag, count: number, startCur: string): string {
    if (typeof tag.id === 'undefined') {
        throw new IllegalArgument("Passed Tag must have an id set.");
    }

    return `https://m.tiktok.com/api/challenge/item_list/?aid=1988&user_agent=&challengeID=${tag.id}&count=${count}&cursor=${startCur}`;
}