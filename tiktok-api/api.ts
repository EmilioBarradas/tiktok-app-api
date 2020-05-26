// API

// TOOD: Add nickname to User
// TODO: Add signature to User

type User = UserWithUsername | UserWithID;

interface UserWithUsername {
    username: string,
    id?: number
}

interface UserWithID {
    id: number,
    username?: string
}

interface Video {
    id: number
}

interface VideoInfo {
    likes: number,
    comments: number,
    shares: number,
    description: string,
    tags: string[],
    audio: Audio
}

interface Audio {
    id: number, // might be a string
    url: string
}

/**
 * Gets the url for the user associated with the username.
 * @param username the username to retrieve the URL from
 */
function getUserURL(username: string): string {
    return 'https://tiktok.com/@' + username;
}

/**
 * Gets the URL of a video.
 * @param user the user of the video
 * @param id the id of the video to retrieve the url from
 */
async function getVideoURL(user: User, id: number): Promise<string> {
    if (typeof user.username === 'undefined') {
        throw Error("Provided User to getVideoURL must have a username set.");
    }
    return 'https://tiktok.com/@' + user.username + '/video/' + id;
}

/**
 * Gets the URL of an audio.
 * @param title the title of the audio
 * @param id the id of the audio
 */
function getAudioURL(title: string, id: number): string {
    return 'https://tiktok.com/music/' + title + '-' + id;
}

/**
 * Gets the tiktok user associated to the username.
 * @param username the username retrieve the user from
 */
async function getUser(username: string): Promise<User> {
    const url = getUserContentURL(username);
    const content = await getTiktokContent(url);

    const user = {
        username: content.userInfo.user.uniqueId,
        id: content.userInfo.user.id
    }

    return Promise.resolve(user);
}

/**
 * Gets the user's last 30 recently uploaded videos.
 * @param user videos are retrieved from this user
 */
async function getUserVideos(user: User): Promise<Video[]> {
    if (typeof user.id === 'undefined' && typeof user.username === 'undefined') {
        throw Error("Provided User to getUserVideos must either have a username or id set.");
    }

    if (typeof user.id === 'undefined') {
        user = await getUser(user.username);
    }

    const recentIDs = await getRecentVideoIDs(user);
    const videos = await Promise.all(
        recentIDs.map(async (id): Promise<Video> => getVideo(id))
    );

    return Promise.resolve(videos);
}

/**
 * Gets the information related to the video.
 * @param video the video to retrieve information from
 */
async function getVideoInfo(video: Video): Promise<VideoInfo> {
    const url = getVideoContentURL(video);
    const content = await getTiktokContent(url);

    const itemStruct = content.itemInfo.itemStruct;

    const stats = itemStruct.stats;
    const tags = itemStruct.textExtra.map(t => t.hashtagName);

    const videoInfo: VideoInfo = {
        likes: stats.diggCount,
        comments: stats.commentCount,
        shares: stats.shareCount,
        description: itemStruct.desc,
        tags: tags,
        audio: {
            id: itemStruct.music.id,
            url: getAudioURL(itemStruct.music.title, itemStruct.music.id)
        }
    }

    return Promise.resolve(videoInfo);
}

/**
 * Gets the video associated with the user and id.
 * @param user the user associated with the video
 * @param id the id of the video
 */
async function getVideo(id: number): Promise<Video> {
    return {
        id: id
    }
}

// REQUESTS

/**
 * Gets the content url of the user associated with the username.
 * @param username the username to retrieve the URL of
 */
function getUserContentURL(username: string): string {
    return 'https://m.tiktok.com/api/user/detail/?uniqueId=' + username;
}

/**
 * Gets the content url of the user's recent upload list.
 * @param user the user to retrieve the url from
 */
function getUserVideosContentURL(user: User): string {
    if (typeof user.id === 'undefined') {
        throw Error("Provided User to getUserVideosContentURL must have and id set.");
    }
    return 'https://m.tiktok.com/api/item_list/?count=30&id=' + user.id 
            + '&type=1&secUid=&maxCursor=0&minCursor=0&sourceType=8&appId=1233';
}

/**
 * Gets the content url of the video.
 * @param video the video to retrieve the url from
 */
function getVideoContentURL(video: Video): string {
    return 'https://m.tiktok.com/api/item/detail/?itemId=' + video.id;
}

/**
 * Gets the video ids of the user's recent uploads.
 * @param user the user to retrieve the recent uploads from
 */
async function getRecentVideoIDs(user: User): Promise<number[]> {
    const url = getUserVideosContentURL(user);
    const content = await getTiktokContent(url);

    const videoIDs: number[] = content.items.map(v => v.id);

    return Promise.resolve(videoIDs);
}

// UTILS

const util = require('util');
const zlib = require('zlib');
const request = require('request');

const get = util.promisify(request.get);
const post = util.promisify(request.post);
const gunzip = util.promisify(zlib.gunzip);

const optionsTemplate = {
    encoding: null,
    headers: {
        'method': 'GET',
        'accept-encoding': 'gzip, deflate, br',
        'referer': 'https://www.tiktok.com/trending?lang=en',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    }
}

/**
 * Gets the JSON content of a URL.
 * @param url the URL to retrieve content from
 */
async function getBody(url: string) {
    const requestOptions = { ...optionsTemplate, url: url };

    const response = await get(requestOptions);
    const body = await gunzip(response.body);
    const json = JSON.parse(body.toString());

    return json;
}

/**
 * Gets the JSON content of a TikTok URL.
 * @param url the URL to retrieve content from
 */
async function getTiktokContent(url: string) {
    const signedURL = await sign(url);
    return getBody(signedURL);
}

/**
 * Signs the TikTok url.
 * @param url the URL to sign
 */
async function sign(url: string): Promise<string> {
    const response = await post('http://localhost:4000/api/sign', { json: { url: url } });
    return url + '&verifyFp=' + response.body.token + '&_signature=' + response.body.signature;
}

exports.getUser = getUser;
exports.getUserVideos = getUserVideos;
exports.getVideo = getVideo;
exports.getVideoInfo = getVideoInfo;