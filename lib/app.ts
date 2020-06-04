import { TikTok, TikTokOptions, User, 
         UserInfo, Video, VideoInfo, 
         Audio, AudioInfo, Tag, TagInfo, 
         SearchOptions, VideoBatch, SubsetFunction } from './types/core';
import { ILLEGAL_IDENTIFIER, RESOURCE_NOT_FOUND, VIDEO_NOT_FOUND, SIGNATURE_NOT_FOUND } from './constants';
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
    this.signer = options.signatureService ? null : await this.getNewSigner();
}

/**
 * Shuts down the application.
 */
app.close = function() {
    this.signer.close();
}

/**
 * Retrieves the top trending videos on TikTok. Currently returns a maximum of 30 videos.
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 */
app.getTrendingVideos = async function(): Promise<VideoInfo[]> {
    const contentURL = getTrendingContentURL();
    const content = await this.getTiktokContent(contentURL);

    return content.items.map((v: object) => getVideoInfoFromContent(v));
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
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 *          The resolved value will be an empty array if none videos are found.
 * @throws `IllegalArgument` Thrown if the User object does not have it's id property set.
 */
app.getUploadedVideos = function(user: User, options: SearchOptions = 
        { count: 30, startCur: '0' }): AsyncGenerator<VideoInfo[]> {
    return getVideoGenerator(getUploadedVideosBatch.bind(this), options.count!, options.startCur!, user);
}

/**
 * Retrieves the information of the liked videos of a TikTok user. Currently returns a maximum of 30 videos.
 * @param user The User object of a TikTok user.
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 *          The resolved value will be an empty array if none videos are found.
 * @throws {IllegalArgument} Thrown if the User object does not have it's id property set.
 */
app.getLikedVideos = async function(user: User): Promise<VideoInfo[]> {
    const contentURL = getLikedVideosContentURL(user);
    const content = await this.getTiktokContent(contentURL);

    if (typeof content.items === 'undefined') {
        return [];
    }

    return content.items.map((v: object) => getVideoInfoFromContent(v));
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
 * Retrieves the top videos of a TikTok audio. Currently returns a maximum of 30 videos.
 * @param audio The Audio object of a TikTok audio.
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 * @throws {IllegalArgument} Thrown if the Audio object does not have it's id property set.
 */
app.getAudioTopVideos = async function(audio: Audio): Promise<VideoInfo[]> {
    const contentURL = getAudioTopContentURL(audio);
    const content = await this.getTiktokContent(contentURL);

    return content.body.itemListData.map((v: object) => getVideoInfoFromTopContent(v));
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
 * Retrieves the top videos of a TikTok tag. Currently returns a maximum of 30 videos.
 * @param audio The Tag object of a TikTok tag.
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 * @throws {IllegalArgument} Thrown if the Tag object does not have it's id property set.
 */
app.getTagTopVideos = async function(tag: Tag): Promise<VideoInfo[]> {
    const contentURL = getTagTopContentURL(tag);
    const content = await this.getTiktokContent(contentURL);

    return content.body.itemListData.map((v: object) => getVideoInfoFromTopContent(v));
}

async function getUploadedVideosBatch(this: TikTok, count: number, 
        startCur: string, user: User): Promise<VideoBatch> {
    const contentURL = getRecentVideosContentURL(user, count, startCur);
    const content = await this.getTiktokContent(contentURL);

    return typeof content.items === 'undefined' 
        ? { 
            videos: [], 
            cur: '-1' 
        } : { 
            videos: content.items.map((v: object) => getVideoInfoFromContent(v)), 
            cur: content.maxCursor, 
        };
}