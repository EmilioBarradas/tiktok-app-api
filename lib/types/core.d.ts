type Nullable<T> = T | null;

interface TikTokOptions {
    signatureService?: string,
}

interface User {
    id: string,
    username?: string,
}

interface UserInfo {
    user: User,
    avatar: string,
    nickname: string,
    signature: string,
    followingCount: number,
    followerCount: number,
    likeCount: number,
    videoCount: number,
}

interface Video {
    id: string,
}

interface VideoInfo {
    video: Video,
    author: User,
    playCount: number,
    likeCount: number,
    commentCount: number,
    shareCount: number,
    description: string,
    tags: Tag[],
    audio: Nullable<AudioInfo>,
}

interface Audio {
    id: string,
}

interface AudioInfo {
    audio: Audio,
    title: string,
    authorName: string,
    covers: CoverImages,
    url: string,
    duration: number,
}

interface CoverImages {
    small: string,
    medium: string,
    large: string,
}

interface Tag {
    id: string,
    title: string,
}

interface TagInfo {
    tag: Tag,
    description: string,
    videoCount: number,
    viewCount: number,
}

interface VideoBatch {
    videos: VideoInfo[],
    cur: string,
}

type GeneratorType = User | Audio | Tag | 'Trending';

type BatchFunction = (count: number, startCur: string, type?: any) => Promise<VideoBatch>;

interface SearchOptions {
    count?: number,
    startCur?: string,
}

interface SignatureResponse {
    signature: string,
    token: string,
}

export interface TikTok {
    /**
     * Settings used by the application.
     */
    options: TikTokOptions;

    /**
     * Shuts down the application.
     */
    close(): void;

    /**
     * Retrieves the information of a subset of the trending videos on TikTok.
     * @param options An optional SearchOptions object that contains the count 
     *                and starting cursor to use for this request.
     *                The default count is 30, and default starting cursor is 0.
     *                Using a count higher than 100 is redundant, as TikTok maxes
     *                out the amount of videos per request at ~100 videos.
     * @returns A promise with the resolved value of an array of VideoInfo objects.
     */
    getTrendingVideos(options?: SearchOptions): AsyncGenerator<VideoInfo[], VideoInfo[]>;

    /**
     * @param username The username of the TikTok user.
     * @returns A promise with the resolved value of a User object.
     * @throws {IllegalIdentifier} Thrown if the username is invalid.
     * @throws {ResourceNotFound} Thrown if a User with the username is not found.
     */
    getUserByName(username: string): Promise<User>;

    /**
     * @param id The unique ID of the TikTok user.
     * @returns A User object with a set id property. Will not fetch the username of the TikTok user.
     */
    getUserByID(id: string): User;

    /**
     * Retrieves the information associated with a TikTok user.
     * @param identifier The User object of a TikTok user or a TikTok user's username.
     * @returns A promise with the resolved value of a UserInfo object.
     * @throws {IllegalIdentifier} Thrown if the username of the User object or the passed username is invalid.
     * @throws {ResourceNotFound} Thrown if a User with the username is not found.
     * @throws {IllegalArgument} Thrown if the User object, if one was passed, does not have it's username property set. 
     */
    getUserInfo(identifier: User | string): Promise<UserInfo>;

    /**
     * Retrieves the information of a subset of videos uploaded by the TikTok user.
     * @param user The User object of a TikTok user.
     * @param options An optional SearchOptions object that contains the count 
     *                and starting cursor to use for this request.
     *                The default count is 30, and default starting cursor is 0.
     *                Using a count higher than 100 is redundant, as TikTok maxes
     *                out the amount of videos per request at ~100 videos.
     * @returns A promise with the resolved value of an array of VideoInfo objects.
     *          The resolved value will be an empty array if none videos are found.
     * @throws `IllegalArgument` Thrown if the User object does not have it's id property set.
     */
    getUploadedVideos(user: User, options?: SearchOptions): AsyncGenerator<VideoInfo[], VideoInfo[]>;

    /**
     * Retrieves the information of a subset of the videos liked by the TikTok user.
     * @param user The User object of a TikTok user.
     * @param options An optional SearchOptions object that contains the count 
     *                and starting cursor to use for this request.
     *                The default count is 30, and default starting cursor is 0.
     *                Using a count higher than 100 is redundant, as TikTok maxes
     *                out the amount of videos per request at ~100 videos.
     * @returns A promise with the resolved value of an array of VideoInfo objects.
     *          The resolved value will be an empty array if none videos are found.
     * @throws `IllegalArgument` Thrown if the User object does not have it's id property set.
     */
    getLikedVideos(user: User, options?: SearchOptions): AsyncGenerator<VideoInfo[], VideoInfo[]>;

    /**
     * @param id The unique ID of the TikTok video.
     * @returns A Video object with a set id property.
     */
    getVideo(id: string): Video;

    /**
     * Retrieves the information associated with a TikTok video.
     * @param identifier The Video object of a TikTok video.
     * @returns A promise with the resolved value of a VideoInfo object.
     * @throws {IllegalIdentifier} Thrown if the id of the Video object is invalid.
     * @throws {ResourceNotFound} Thrown if a Video with the id is not found.
     * @throws {IllegalArgument} Thrown if the Video object does not have it's id property set. 
     */
    getVideoInfo(video: Video): Promise<VideoInfo>;

    /**
     * @param id The unique ID of the TikTok audio.
     * @returns An Audio object with a set id property.
     */
    getAudio(id: string): Audio;

    /**
     * Retrieves the information associated with a TikTok audio.
     * @param identifier The Audio object of a TikTok audio.
     * @returns A promise with the resolved value of a AudioInfo object.
     * @throws {IllegalIdentifier} Thrown if the id of the Audio object is invalid.
     * @throws {ResourceNotFound} Thrown if an Audio with the id is not found.
     * @throws {IllegalArgument} Thrown if the Audio object does not have it's id property set.
     */
    getAudioInfo(audio: Audio): Promise<AudioInfo>;

    /**
     * Retrieves the information of a subset of the top videos of the TikTok audio.
     * @param audio The Audio object of a TikTok audio.
     * @param options An optional SearchOptions object that contains the count 
     *                and starting cursor to use for this request.
     *                The default count is 30, and default starting cursor is 0.
     *                Using a count higher than 100 is redundant, as TikTok maxes
     *                out the amount of videos per request at ~100 videos.
     * @returns A promise with the resolved value of an array of VideoInfo objects.
     * @throws {IllegalArgument} Thrown if the Audio object does not have it's id property set.
     */
    getAudioTopVideos(audio: Audio, options?: SearchOptions): AsyncGenerator<VideoInfo[], VideoInfo[]>;

    /**
     * @param id The unique ID of the TikTok tag.
     * @returns A Tag object with set id and title properties. Will fetch the title from the TikTok API.
     * @throws {ResourceNotFound} Thrown if a Tag with the id is not found.
     */
    getTag(id: string): Promise<Tag>;

    /**
     * Retrieves the information associated with a TikTok tag.
     * @param identifier The Tag object of a TikTok tag or a TikTok tag's id.
     * @returns A promise with the resolved value of a TagInfo object.
     * @throws {ResourceNotFound} Thrown if a Tag with the id is not found.
     * @throws {IllegalArgument} Thrown if the Tag object does not have it's id property set.
     */
    getTagInfo(identifier: Tag | string): Promise<TagInfo>;

    /**
     * Retrieves the information of a subset of the top videos of the TikTok tag.
     * @param audio The Tag object of a TikTok tag.
     * @param options An optional SearchOptions object that contains the count 
     *                and starting cursor to use for this request.
     *                The default count is 30, and default starting cursor is 0.
     *                Using a count higher than 100 is redundant, as TikTok maxes
     *                out the amount of videos per request at ~100 videos.
     * @returns A promise with the resolved value of an array of VideoInfo objects.
     * @throws {IllegalArgument} Thrown if the Tag object does not have it's id property set.
     */
    getTagTopVideos(tag: Tag, options?: SearchOptions): AsyncGenerator<VideoInfo[], VideoInfo[]>;

    IllegalArgument: Function,

    IllegalIdentifier: Function,

    IllegalOptions: Function,

    ResourceNotFound: Function,

    /**
     * @private
     */
    init(options: TikTokOptions): Promise<void>;

    /**
     * @private
     */
    getTiktokContent: Function;

    /**
     * @private
     */
    signURL: Function;
}