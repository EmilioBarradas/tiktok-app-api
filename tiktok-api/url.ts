import { User, Video, Audio, Tag } from './types';

export function getUserInfoContentURL(identifier: User | string): string {
    if (typeof identifier === 'string') {
        return 'https://m.tiktok.com/api/user/detail/?uniqueId=' + identifier;
    }
    return 'https://m.tiktok.com/api/user/detail/?uniqueId=' + identifier.username;
}

export function getRecentVideosContentURL(user: User): string {
    return 'https://m.tiktok.com/api/item_list/?count=30&id=' + user.id 
            + '&type=1&secUid=&maxCursor=0&minCursor=0&sourceType=8&appId=1233';
}

export function getLikedVideosContentURL(user: User): string {
    return 'https://m.tiktok.com/api/item_list/?count=30&id=' + user.id 
            + '&type=2&secUid=&maxCursor=0&minCursor=0&sourceType=9&appId=1233';
}

export function getVideoInfoContentURL(video: Video): string {
    return 'https://m.tiktok.com/api/item/detail/?itemId=' + video.id;
}

export function getAudioInfoContentURL(audio: Audio): string {
    return 'https://m.tiktok.com/api/music/detail/?musicId=' + audio.id;
}

export function getAudioTopContentURL(audio: Audio): string {
    return 'https://m.tiktok.com/share/item/list?secUid=&id=' + audio.id 
            + '&type=4&count=30&minCursor=0&maxCursor=0&shareUid=';
}

export function getTagInfoContentURL(identifier: Tag | string): string {
    if (typeof identifier === 'string') {
        return 'https://m.tiktok.com/api/challenge/detail/?challengeName=' + identifier;
    }
    return 'https://m.tiktok.com/api/challenge/detail/?challengeName=' + identifier.title;
}

export function getTagTopContentURL(tag: Tag): string {
    return 'https://m.tiktok.com/share/item/list?secUid=&id=' + tag.id
            + '&type=3&count=30&minCursor=0&maxCursor=0&shareUid=';
}