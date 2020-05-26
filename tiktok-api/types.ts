export interface User {
    id: string,
    username: string,
}

export interface UserInfo {
    user: User,
    avatar: string,
    nickname: string,
    signature: string,
    followingCount: number,
    followerCount: number,
    likeCount: number,
    videoCount: number,
}

export interface Video {
    id: string,
}

export interface VideoInfo {
    video: Video,
    author: User,
    playCount: number,
    likeCount: number,
    commentCount: number,
    shareCount: number,
    description: string,
    tags: Tag[],
    audio: AudioInfo,
}

export interface Audio {
    id: string,
}

export interface AudioInfo {
    audio: Audio,
    title: string,
}

export interface Tag {
    id: string,
    title: string,
}

export interface TagInfo {
    tag: Tag,
    description: string,
    videoCount: number,
    viewCount: number,
}