import { TikTok, TikTokOptions, User, 
         UserInfo, Video, VideoInfo, 
         Audio, AudioInfo, Tag, TagInfo, 
         SearchOptions, VideoBatch } from './types/core';
import { ILLEGAL_IDENTIFIER, RESOURCE_NOT_FOUND, VIDEO_NOT_FOUND, 
         SIGNATURE_NOT_FOUND } from './constants';
import { IllegalIdentifier } from './errors/IllegalIdentifier';
import { ResourceNotFound } from './errors/ResourceNotFound';
import { getTrendingContentURL, getUserInfoContentURL, getRecentVideosContentURL, 
         getLikedVideosContentURL, getVideoInfoContentURL, getAudioInfoContentURL, 
         getAudioTopContentURL, getTagInfoContentURL, getTagTopContentURL } from './url';
import { getVideoInfoFromContent, getUserFromID, getUserInfoFromContent, 
         getVideoFromID, getAudioFromID, getAudioInfoFromContent, 
         getTagInfoFromContent, getVideoInfoFromTopContent } from './constructor';
import { isSignatureInstalled, getVideoGenerator } from './utility';

export const app = {} as TikTok;

/**
 * Initializes the default settings of the application.
 * @private
 */
app.init = async function(options: TikTokOptions): Promise<void> {
    if (!options.signatureService && !isSignatureInstalled()) {
        console.error(SIGNATURE_NOT_FOUND);
        process.exit(1);
    }

    this.options = options;
}

/**
 * Shuts down the application.
 */
app.close = function() {
}

/**
 * Retrieves the information of a subset of the trending videos on TikTok.
 * @param options An optional SearchOptions object that contains the count 
 *                and starting cursor to use for this request.
 *                The default count is 30, and default starting cursor is 0.
 *                Using a count higher than 100 is redundant, as TikTok maxes
 *                out the amount of videos per request at ~100 videos.
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 */
app.getTrendingVideos = function({ count = 30, startCur = '0' }: SearchOptions = {}): 
        AsyncGenerator<VideoInfo[], VideoInfo[]> {
    return getVideoGenerator(getTrendingVideosBatch.bind(this), count, startCur, 'Trending');
}

/**
 * @param username The username of the TikTok user.
 * @returns A promise with the resolved value of a User object.
 * @throws {IllegalIdentifier} Thrown if the username is invalid.
 * @throws {ResourceNotFound} Thrown if a User with the username is not found.
 */
app.getUserByName = async function(username: string): Promise<User> {
    const userInfo = await this.getUserInfo(username);

    return userInfo.user;
}

/**
 * @param id The unique ID of the TikTok user.
 * @returns A User object with a set id property. Will not fetch the username of the TikTok user.
 */
app.getUserByID = function(id: string): User {
    return getUserFromID(id);
}

/**
 * Retrieves the information associated with a TikTok user.
 * @param identifier The User object of a TikTok user or a TikTok user's username.
 * @returns A promise with the resolved value of a UserInfo object.
 * @throws {IllegalIdentifier} Thrown if the username of the User object or the passed username is invalid.
 * @throws {ResourceNotFound} Thrown if a User with the username is not found.
 * @throws {IllegalArgument} Thrown if the User object, if one was passed, does not have it's username property set. 
 */
app.getUserInfo = async function(identifier: User | string): Promise<UserInfo> {
    const contentURL = getUserInfoContentURL(identifier);
    const content = await this.getTiktokContent(contentURL);

    if (content.statusCode === ILLEGAL_IDENTIFIER) {
        throw new IllegalIdentifier("An illegal identifier was used for this request.");
    } else if (content.statusCode === RESOURCE_NOT_FOUND) {
        throw new ResourceNotFound("Could not find a User with the given identifier.");
    }

    return getUserInfoFromContent(content);
}

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
app.getUploadedVideos = function(user: User, { count = 30, startCur = '0' }: SearchOptions = {}): 
        AsyncGenerator<VideoInfo[], VideoInfo[]> {
    return getVideoGenerator(getUploadedVideosBatch.bind(this), count, startCur, user);
}

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
app.getLikedVideos = function(user: User, { count = 30, startCur = '0' }: SearchOptions = {}): 
        AsyncGenerator<VideoInfo[], VideoInfo[]> {
    return getVideoGenerator(getLikedVideosBatch.bind(this), count, startCur, user);
}

/**
 * @param id The unique ID of the TikTok video.
 * @returns A Video object with a set id property.
 */
app.getVideo = function(id: string): Video {
    return getVideoFromID(id);
}

/**
 * Retrieves the information associated with a TikTok video.
 * @param identifier The Video object of a TikTok video.
 * @returns A promise with the resolved value of a VideoInfo object.
 * @throws {IllegalIdentifier} Thrown if the id of the Video object is invalid.
 * @throws {ResourceNotFound} Thrown if a Video with the id is not found.
 * @throws {IllegalArgument} Thrown if the Video object does not have it's id property set. 
 */
app.getVideoInfo = async function(video: Video): Promise<VideoInfo> {
    const contentURL = getVideoInfoContentURL(video);
    const content = await this.getTiktokContent(contentURL);

    if (content.statusCode === ILLEGAL_IDENTIFIER) {
        throw new IllegalIdentifier("An illegal identifier was used for this request.");
    } else if (content.statusCode === VIDEO_NOT_FOUND) {
        throw new ResourceNotFound("Could not find a Video with the given identifier.");
    }

    return getVideoInfoFromContent(content.itemInfo.itemStruct);
}

/**
 * @param id The unique ID of the TikTok audio.
 * @returns An Audio object with a set id property.
 */
app.getAudio = function(id: string): Audio {
    return getAudioFromID(id);
}

/**
 * Retrieves the information associated with a TikTok audio.
 * @param identifier The Audio object of a TikTok audio.
 * @returns A promise with the resolved value of a AudioInfo object.
 * @throws {IllegalIdentifier} Thrown if the id of the Audio object is invalid.
 * @throws {ResourceNotFound} Thrown if an Audio with the id is not found.
 * @throws {IllegalArgument} Thrown if the Audio object does not have it's id property set.
 */
app.getAudioInfo = async function(audio: Audio): Promise<AudioInfo> {
    const contentURL = getAudioInfoContentURL(audio);
    const content = await this.getTiktokContent(contentURL);

    if (content.statusCode === ILLEGAL_IDENTIFIER) {
        throw new IllegalIdentifier("An illegal identifier was used for this request.");
    } else if (content.statusCode === RESOURCE_NOT_FOUND) {
        throw new ResourceNotFound("Could not find an Audio with the given identifier.");
    }

    return getAudioInfoFromContent(content);
}

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
app.getAudioTopVideos = function(audio: Audio, { count = 30, startCur = '0' }: SearchOptions = {}): 
        AsyncGenerator<VideoInfo[], VideoInfo[]> {
    return getVideoGenerator(getAudioTopVideosBatch.bind(this), count, startCur, audio)
}

/**
 * @param id The unique ID of the TikTok tag.
 * @returns A Tag object with set id and title properties. Will fetch the title from the TikTok API.
 * @throws {ResourceNotFound} Thrown if a Tag with the id is not found.
 */
app.getTag = async function(id: string): Promise<Tag> {
    const tagInfo = await this.getTagInfo(id);

    return tagInfo.tag;
}

/**
 * Retrieves the information associated with a TikTok tag.
 * @param identifier The Tag object of a TikTok tag or a TikTok tag's id.
 * @returns A promise with the resolved value of a TagInfo object.
 * @throws {ResourceNotFound} Thrown if a Tag with the id is not found.
 * @throws {IllegalArgument} Thrown if the Tag object does not have it's id property set.
 */
app.getTagInfo = async function(identifier: Tag | string): Promise<TagInfo> {
    const contentURL = getTagInfoContentURL(identifier);
    const content = await this.getTiktokContent(contentURL);

    if (content.statusCode === RESOURCE_NOT_FOUND) {
        throw new ResourceNotFound("Could not find a Tag with the given identifier.");
    }

    return getTagInfoFromContent(content);
}

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
app.getTagTopVideos = function(tag: Tag, { count = 30, startCur = '0' }: SearchOptions = {}): 
        AsyncGenerator<VideoInfo[], VideoInfo[]> {
    return getVideoGenerator(getTagTopVideosBatch.bind(this), count, startCur, tag);
}

async function getTrendingVideosBatch(this: TikTok, count: number, startCur: string): Promise<VideoBatch> {
    const contentURL = getTrendingContentURL(count, startCur);

    return getVideosBatch.call(this, contentURL);
}

async function getUploadedVideosBatch(this: TikTok, count: number, 
        startCur: string, user: User): Promise<VideoBatch> {
    const contentURL = getRecentVideosContentURL(user, count, startCur);

    return getVideosBatch.call(this, contentURL);
}

async function getLikedVideosBatch(this: TikTok, count: number, 
        startCur: string, user: User): Promise<VideoBatch> {
    const contentURL = getLikedVideosContentURL(user, count, startCur);

    return getVideosBatch.call(this, contentURL);
}

async function getVideosBatch(this: TikTok, url: string): Promise<VideoBatch> {
    const content = await this.getTiktokContent(url);

    return typeof content.items === 'undefined' ? 
        { 
            videos: [], 
            cur: '-1', 
        } : { 
            videos: content.items.map((v: object) => getVideoInfoFromContent(v)), 
            cur: content.maxCursor, 
        };
}

async function getAudioTopVideosBatch(this: TikTok, count: number, 
        startCur: string, audio: Audio): Promise<VideoBatch> {
    const contentURL = getAudioTopContentURL(audio, count, startCur);

    return getTopVideosBatch.call(this, contentURL);
}

async function getTagTopVideosBatch(this: TikTok, count: number,
        startCur: string, tag: Tag): Promise<VideoBatch> {
    const contentURL = getTagTopContentURL(tag, count, startCur);

    return getTopVideosBatch.call(this, contentURL);
}

async function getTopVideosBatch(this: TikTok, url: string) {
    const content = await this.getTiktokContent(url);

    return {
        videos: content.body.itemListData.map((v: object) => getVideoInfoFromTopContent(v)),
        cur: content.body.maxCursor,
    }
}