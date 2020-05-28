import { User, UserInfo, Video, VideoInfo, Audio, AudioInfo, Tag, TagInfo } from './types/core';

export function getUserFromID(id: string): User {
    return {
        id: id
    }
}

export function getUserInfoFromContent(obj: any): UserInfo {
    const user = obj.userInfo.user;
    const stats = obj.userInfo.stats;

    return {
        user: {
            id: user.id,
            username: user.uniqueId,
        },
        avatar: user.avatarThumb,
        nickname: user.nickname,
        signature: user.signature,
        followingCount: stats.followingCount,
        followerCount: stats.followerCount,
        likeCount: stats.heartCount,
        videoCount: stats.videoCount,
    }
}

export function getVideoFromID(id: string): Video {
    return {
        id: id,
    }
}

export function getVideoInfoFromContent(obj: any): VideoInfo {
    const tags = typeof obj.challenges !== 'undefined' ? obj.challenges.map((t: object) => getTagFromContent(t)) : [];

    return {
        video: {
            id: obj.id,
        },
        author: {
            id: obj.author.id,
            username: obj.author.uniqueId,
        },
        playCount: obj.stats.playCount,
        likeCount: obj.stats.diggCount,
        commentCount: obj.stats.commentCount,
        shareCount: obj.stats.shareCount,
        description: obj.desc,
        tags: tags,
        audio: {
            audio: {
                id: obj.music.id,
            },
            title: obj.music.title,
        },
    }
}

export function getVideoInfoFromTopContent(obj: any): VideoInfo {
    return {
        video: {
            id: obj.itemInfos.id,
        },
        author: {
            id: obj.authorInfos.userId,
            username: obj.authorInfos.uniqueId,
        },
        playCount: obj.itemInfos.playCount,
        likeCount: obj.itemInfos.diggCount,
        commentCount: obj.itemInfos.commentCount,
        shareCount: obj.itemInfos.shareCount,
        description: obj.itemInfos.text,
        tags: obj.challengeInfoList.map((t: object) => getTagFromTopContent(t)),
        audio: {
            audio: {
                id: obj.musicInfos.musicId,
            },
            title: obj.musicInfos.musicName,
        },
    }
}

export function getAudioFromID(id: string): Audio {
    return {
        id: id,
    }
}

export function getAudioInfoFromContent(obj: any): AudioInfo {
    return {
        audio: {
            id: obj.musicInfo.music.id,
        },
        title: obj.musicInfo.music.title,
    }
}

export function getTagFromContent(obj: any): Tag {
    return {
        id: obj.id,
        title: obj.title,
    }
}

export function getTagFromTopContent(obj: any): Tag {
    return {
        id: obj.challengeId,
        title: obj.challengeName,
    }
}

export function getTagInfoFromContent(obj: any): TagInfo {
    const challenge = obj.challengeInfo.challenge;
    const stats = obj.challengeInfo.stats;

    return {
        tag: {
            id: challenge.id,
            title: challenge.title,
        },
        description: challenge.desc,
        videoCount: stats.videoCount,
        viewCount: stats.viewCount,
    }
}