import { User, UserInfo, Video, VideoInfo, Audio, AudioInfo, Tag, TagInfo } from './types';

import utility = require('./utility');
import url = require('./url');
import constructor = require('./constructor');

export async function getUserByName(username: string): Promise<User> {
    const userInfo = await getUserInfo(username);

    return userInfo.user;
}

export function getUserByID(id: string): User {
    return constructor.getUserFromID(id);
}

export async function getUserInfo(identifier: User | string): Promise<UserInfo> {
    const contentURL = url.getUserInfoContentURL(identifier);
    const content = await utility.getTiktokContent(contentURL);

    return constructor.getUserInfoFromContent(content);
}

export async function getRecentVideos(user: User): Promise<VideoInfo[]> {
    const contentURL = url.getRecentVideosContentURL(user);
    const content = await utility.getTiktokContent(contentURL);

    return content.items.map((v: object) => constructor.getVideoInfoFromContent(v));
}

export async function getLikedVideos(user: User): Promise<VideoInfo[]> {
    const contentURL = url.getLikedVideosContentURL(user);
    const content = await utility.getTiktokContent(contentURL);

    return content.items.map((v: object) => constructor.getVideoInfoFromContent(v));
}

export function getVideo(id: string): Video {
    return constructor.getVideoFromID(id);
}

export async function getVideoInfo(video: Video): Promise<VideoInfo> {
    const contentURL = url.getVideoInfoContentURL(video);
    const content = await utility.getTiktokContent(contentURL);

    return constructor.getVideoInfoFromContent(content);
}

export function getAudio(id: string): Audio {
    return constructor.getAudioFromID(id);
}

export async function getAudioInfo(audio: Audio): Promise<AudioInfo> {
    const contentURL = url.getAudioInfoContentURL(audio);
    const content = await utility.getTiktokContent(contentURL);

    return constructor.getAudioInfoFromContent(content);
}

export async function getAudioTopVideos(audio: Audio): Promise<VideoInfo[]> {
    const contentURL = url.getAudioTopContentURL(audio);
    const content = await utility.getTiktokContent(contentURL);

    return content.body.itemListData.map((v: object) => constructor.getVideoInfoFromTopContent(v));
}

export async function getTag(id: string): Promise<Tag> {
    const tagInfo = await getTagInfo(id);

    return tagInfo.tag;
}

export async function getTagInfo(tag: Tag | string): Promise<TagInfo> {
    const contentURL = url.getTagInfoContentURL(tag);
    const content = await utility.getTiktokContent(contentURL);

    return constructor.getTagInfoFromContent(content);
}

export async function getTagTopVideos(tag: Tag): Promise<VideoInfo[]> {
    const contentURL = url.getTagTopContentURL(tag);
    const content = await utility.getTiktokContent(contentURL);

    return content.body.itemListData.map((v: object) => constructor.getVideoInfoFromTopContent(v));
}