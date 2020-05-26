import { User, UserInfo, Video, VideoInfo, Audio, AudioInfo, Tag, TagInfo } from './types';
import { getTiktokContent } from './utility';

import * as url from './url';
import * as constructor from "./constructor";

async function getUser(username: string): Promise<User> {
    const userInfo = await getUserInfo(username);

    return userInfo.user;
}

async function getUserInfo(identifier: User | string): Promise<UserInfo> {
    const contentURL = url.getUserInfoContentURL(identifier);
    const content = await getTiktokContent(contentURL);

    return constructor.getUserInfoFromContent(content);
}

async function getRecentVideos(user: User): Promise<VideoInfo[]> {
    const contentURL = url.getRecentVideosContentURL(user);
    const content = await getTiktokContent(contentURL);

    return content.items.map((v: object) => constructor.getVideoInfoFromContent(v));
}

async function getLikedVideos(user: User): Promise<VideoInfo[]> {
    const contentURL = url.getLikedVideosContentURL(user);
    const content = await getTiktokContent(contentURL);

    return content.items.map((v: object) => constructor.getVideoInfoFromContent(v));
}

function getVideo(id: string): Video {
    return constructor.getVideoFromID(id);
}

async function getVideoInfo(video: Video): Promise<VideoInfo> {
    const contentURL = url.getVideoInfoContentURL(video);
    const content = await getTiktokContent(contentURL);

    return constructor.getVideoInfoFromContent(content);
}

function getAudio(id: string): Audio {
    return constructor.getAudioFromID(id);
}

async function getAudioInfo(audio: Audio): Promise<AudioInfo> {
    const contentURL = url.getAudioInfoContentURL(audio);
    const content = await getTiktokContent(contentURL);

    return constructor.getAudioInfoFromContent(content);
}

async function getAudioTopVideos(audio: Audio): Promise<VideoInfo[]> {
    const contentURL = url.getAudioTopContentURL(audio);
    const content = await getTiktokContent(contentURL);

    return content.body.itemListData.map((v: object) => constructor.getVideoInfoFromTopContent(v));
}

async function getTag(id: string): Promise<Tag> {
    const tagInfo = await getTagInfo(id);

    return tagInfo.tag;
}

async function getTagInfo(tag: Tag | string): Promise<TagInfo> {
    const contentURL = url.getTagInfoContentURL(tag);
    const content = await getTiktokContent(contentURL);

    return constructor.getTagInfoFromContent(content);
}

async function getTagTopVideos(tag: Tag): Promise<VideoInfo[]> {
    const contentURL = url.getTagTopContentURL(tag);
    const content = await getTiktokContent(contentURL);

    return content.body.itemListData.map((v: object) => constructor.getVideoInfoFromTopContent(v));
}