# TikTok API

This is an unofficial Node.js implementation of the TikTok API. This module is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by TikTok. Their internal API could change at any moment, and break this module's code. I try my best to maintain it, and keep it up-to-date. If you find bugs or have any questions, please submit an issue, and I will try my best to help you out.

Table of Contents
---

* [Quick Examples](#quick-examples)
* [Installation](#installation)
* [Usage](#usage)
  * [Application Instance](#application-instance)
  * [Options](#options)
  * [Trending](#trending)
  * [Users](#users)
  * [Videos](#videos)
  * [Audios](#audios)
  * [Tags](#tags)
* [Object Reference](#object-reference)
  * [TikTokOptions](#tiktokoptions)
  * [User](#user)
  * [UserInfo](#userinfo)
  * [Video](#video)
  * [VideoInfo](#videoinfo)
  * [Audio](#audio)
  * [AudioInfo](#audioinfo)
  * [Tag](#tag)
  * [TagInfo](#taginfo)

Quick Examples
---

Get the follower count of a TikTok user:

```javascript
const tiktok = require('tiktok-app-api');

let tiktokApp;

main();

async function main() {
  tiktokApp = await tiktok();

  const user = await tiktokApp.getUserByName('example');
  const userInfo = await tiktokApp.getUserInfo(user);

  console.log(userInfo.followerCount);
}
```

Get the tags of the top trending video:

```javascript
const tiktok = require('tiktok-app-api');

let tiktokApp;

main();

async function main() {
  tiktokApp = await tiktok();

  const trendingVideos = await tiktokApp.getTrendingVideos();

  console.log(trendingVideos[0].tags);
}
```

Installation
---

Install the api:

```console
npm i tiktok-app-api
```

Import into your program.

```javascript
const tiktok = require('tiktok-app-api');

// Or, if you are using TypeScript:
import tiktok = require('tiktok-app-api'):
```

[Puppeteer](https://github.com/puppeteer/puppeteer) will be installed alongside this module, as API requests are made through a  headless Puppeteer browser instance. Although, take a look at [TikTok-Web-API](https://github.com/TikStock/tiktok-web-api-example) to run this as a separate web service.

Usage
---

At the moment, the majority of the API returns promises, and may throw errors in certain situations. When a promise is not returned, or if a function may throw an error, it will be mentioned.

### Application Instance

To start using the API, you must first instantiate an instance of the application.

```javascript
const tiktok = require('tiktok-app-api');

let tiktokApi;

main();

async function main() {
  tiktokApi = await tiktok();
}
```

While instantiating a new instance of the application, the puppeteer browser and any default settings of the application will be set up.

### Options

If you would like to use your own signature service instead of the default option, you can specify this in a TikTokOptions object.

```javascript
const options = {
  signatureService: 'http://localhost:8000/api/sign'
}

tiktokApi.useOptions(options);
```

### Trending

To get the top trending videos using the API is as simple as:

```javascript
const trendingVideos = await tiktokApp.getTrendingVideos();

console.log(trendingVideos);
```

### Users

To retrieve User information within the API, you will first need to get a User object. See [User](#user) for a definition of the User object.

Get a User object from a TikTok user's username:

Will fetch ID of user from TikTok API. May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#L47).

```javascript
const user = await tiktokApp.getUserByName('example');
```

Get a User object from a TikTok user's id:

Will not fetch username of user from TikTok API.

```javascript
const user = tiktokApp.getUserByID('6828402025898902533');
```

Take note that getUserByID(id) does not return a promise, as it does not fetch any information from the TikTok API.

Now that we have a User object, we can retrieve some information from the TikTok user:

See [UserInfo](#userinfo) for a defintion of the UserInfo object. May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#L67).

```javascript
const userInfo = await tiktokApp.getUserInfo(user);

console.log(userInfo.followingCount, userInfo.followerCount, userInfo.likeCount);
```

Now, let's get the user's lastest videos:

See [VideoInfo](#videoinfo) for a definition of the VideoInfo object. May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#L88).

```javascript
const recentVideos = await tiktokApp.getRecentVideos(user);

console.log(recentVideos[0].description, recentVideos[0].playCount, recentVideos[0].tags);
```

Same idea, we can get the user's liked videos:

May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#L106).

```javascript
const likedVideos = await tiktokApp.getLikedVideos(user);

console.log(likedVideos[0].audio, likedVideos[0].shareCount, likedVideos[0].likeCount);
```

That covers users. Let's move on to TikTok videos.

### Videos

Just like how previously we needed our User object, we now need our Video object. See [Video](#video) for a definition of the Video object.

```javascript
const video = tiktokApp.getVideo('6829280471411674374');
```

Take note that getVideo(id) does not return a promise, as it does not fetch any information from the TikTok API.

Now to get the information of this video:

May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#L132).

```javascript
const videoInfo = await tiktokApp.getVideoInfo(video);

console.log(videoInfo.commentCount, videoInfo.author, videoInfo.video.id);
```

That's all there is for videos, for now. Now on to Tiktok audios.

### Audios

Just like Users and Videos, we first need an Audio object.

```javascript
const audio = tiktokApp.getAudio('6829280451471969029');
```

Take note that getAudio(id) does not return a promise, as it does not fetch any information from the TikTok API.

To get the information related to the audio:

See [AudioInfo](#audioinfo) for a definition of the AudioInfo object. May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#L161).

```javascript
const audioInfo = await tiktokApp.getAudioInfo(audio);

console.log(audioInfo.title, audioInfo.audio.title);
```

To get the top videos related to an audio:

The first object of this VideoInfo array will be the original video with the audio. May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#L182).

```javascript
const topVideos = await tiktokApp.getAudioTopVideos(audio);

console.log(topVideos[0]);
```

Finally we have TikTok tags.

### Tags

Just like Users, Videos, and Audios, we need a Tag object.

Will fetch the title from the TikTok API, therefore this function returns a promise. May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#L195).

```javascript
const tag = await tiktokApp.getTag('fyp');
```

To retrieve the information associated with the tag:

See [TagInfo](#taginfo) for a definition of the TagInfo object. May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#206).

```javascript
const tagInfo = await tiktokApp.getTagInfo(tag);

console.log(tagInfo.description, tagInfo.videoCount, tagInfo.viewCount);
```

To get the top videos of a tag:

May throw an error in certain situations, see [here](../c316a7cd2500e6242f22ec0d35bc145160db292c/lib/app.ts#L224).

```javascript
const topVideos = await tiktokApp.getTagTopVideos(tag);

console.log(topVideos);
```

Object Reference
---

Below you will find the data that each object contains.

### TikTokOptions
```yaml
TikTokOptions {
  signatureService?: string // Not required.
}
```

### User
```yaml
User {
  id: string,
  username?: string // Not required initially.
}
```

### UserInfo

```yaml
UserInfo {
  user: User,
  avatar: string,
  nickname: string,
  signature: string,
  followingCount: number,
  followerCount: number,
  likeCount: number,
  videoCount: number
}
```

### Video

```yaml
Video {
  id: string
}
```

### VideoInfo

```yaml
VideoInfo {
  video: Video,
  author: User,
  playCount: number,
  likeCount: number,
  commentCount: number,
  shareCount: number,
  description: string,
  tags: Tag[],
  audio: AudioInfo
}
```

### Audio

```yaml
Audio {
  id: string
}
```

### AudioInfo

```yaml
AudioInfo {
  id: string,
  title: string
}
```

### Tag

```yaml
Tag {
  id: string,
  title: string
}
```

### TagInfo

```yaml
TagInfo {
  tag: Tag,
  description: string,
  videoCount: number,
  viewCount: number
}
```
