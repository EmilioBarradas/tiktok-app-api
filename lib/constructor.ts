import { User, UserInfo, Video, VideoInfo, Audio, AudioInfo, Tag, TagInfo, Nullable } from './types/core';

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
    const tags = typeof obj.challenges !== 'undefined' 
        ? obj.challenges.map((t: object) => getTagFromContent(t)) 
        : [];

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
        audio: getAudioInfoFromContent(obj),
    }
}

export function getVideoInfoFromTopContent(obj: any): VideoInfo {
    const tags = typeof obj.challengs !== 'undefined' ? obj.challenges.map((t: object) => getTagFromTopContent(t)) : [];

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
        audio: getAudioInfoFromContent(obj),
    }
}

export function getAudioFromID(id: string): Audio {
    return {
        id: id,
    }
}

export function getAudioInfoFromContent(obj: any): AudioInfo {
    if (typeof obj.musicInfos !== 'undefined') {
        return {
            audio: {
                id: obj.musicInfos.musicId,
            },
            title: obj.musicInfos.musicName,
            authorName: obj.musicInfos.authorName,
            covers: {
                small: obj.musicInfos.covers[0],
                medium: obj.musicInfos.coversMedium[0],
                large: obj.musicInfos.coversLarger[0],
            },
            url: obj.musicInfos.playUrl,
            duration: -1,
        }
    }

    let musicObj = typeof obj.musicInfo !== 'undefined' ? obj.musicInfo.music : obj.music;

    return {
        audio: {
            id: musicObj.id,
        },
        title: musicObj.title,
        authorName: musicObj.authorName,
        covers: {
            small: musicObj.coverThumb,
            medium: musicObj.coverMedium,
            large: musicObj.coverLarge,
        },
        url: musicObj.playUrl,
        duration: musicObj.duration,
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
        id: obj.id,
        title: obj.title,
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