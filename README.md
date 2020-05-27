# TikTok API

This is an unofficial Node.js implementation of the TikTok API. This module is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by TikTok. Their internal API could change at any moment, and break this module's code. I try my best to maintain it, and keep it up-to-date. If you find bugs or have any questions, please submit an issue, and I will try my best to help you out.

Table of Contents
---
* [Quick Examples](#Quick-Examples)
* [Installation](#Installation)
* [Usage](#Usage)
  * [Trending](#Trending)
  * [Users](#Users)
  * [Videos](#Videos)
  * [Audios](#Audios)
  * [Tags](#Tags)
* [Object Reference](#Object-Reference)
  * [User](#User)
  * [UserInfo](#UserInfo)
  * [Video](#Video)
  * [VideoInfo](#VideoInfo)
  * [Audio](#Audio)
  * [AudioInfo](#AudioInfo)
  * [Tag](#Tag)
  * [TagInfo](#TagInfo)

Quick Examples
---

Get the follower count of a TikTok user:
```javascript
const tiktok = require('tiktok-app-api');

const user = await tiktok.getUserByName('example');
const userInfo = await tiktok.getUserInfo(user);

console.log(userInfo.followerCount);
```

Get the tags of the top trending video:
```javascript
const tiktok = require('tiktok-app-api');

const trendingVideos = await tiktok.getTrendingVideos();

console.log(trendingVideos[0].tags);
```

Installation
---

You must install puppeteer in order to run the API. Although, take a look at [TikTok-Web-API](https://github.com/EmilioBarradas/TikTok-Web-Api) to run this module as a web service.

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

Usage
---

At the moment, the majority of the API returns promises, and may throw errors in certain situations. When a promise is not returned, or if a function may throw an error, it will be mentioned.

### Trending

To get the top trending videos using the API is as simple as:

```javascript
const trendingVideos = await tiktok.getTrendingVideos();

console.log(trendingVideos);
```

### Users

To retrieve User information within the API, you will first need to get a User object. See [User](#User) for a definition of the User object.

Get a User object from a TikTok user's username:

Will fetch ID of user from TikTok API. May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L10).

```javascript
const user = await tiktok.getUserByName('example');
```

Get a User object from a TikTok user's id:

Will not fetch username of user from TikTok API.

```javascript
const user = tiktok.getUserByID('6828402025898902533');
```

Take note that getUserByID(id) does not return a promise, as it does not fetch any information from the TikTok API.

Now that we have a User object, we can retrieve some information from the TikTok user:

See [UserInfo](#UserInfo) for a defintion of the UserInfo object. May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L30).

```javascript
const userInfo = await tiktok.getUserInfo(user);

console.log(userInfo.followingCount, userInfo.followerCount, userInfo.likeCount);
```

Now, let's get the user's lastest videos:

See [VideoInfo](#VideoInfo) for a definition of the VideoInfo object. May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L51).

```javascript
const recentVideos = await tiktok.getRecentVideos(user);

console.log(recentVideos[0].description, recentVideos[0].playCount, recentVideos[0].tags);
```

Same idea, we can get the user's liked videos:

May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L69).

```javascript
const likedVideos = await tiktok.getLikedVideos(user);

console.log(likedVideos[0].audio, likedVideos[0].shareCount, likedVideos[0].likeCount);
```

That covers users. Let's move on to TikTok videos.

### Videos

Just like how previously we needed our User object, we now need our Video object. See [Video](#Video) for a definition of the Video object.

```javascript
const video = tiktok.getVideo('6829280471411674374');
```

Take note that getVideo(id) does not return a promise, as it does not fetch any information from the TikTok API.

Now to get the information of this video:

May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L95).

```javascript
const videoInfo = await tiktok.getVideoInfo(video);

console.log(videoInfo.commentCount, videoInfo.author, videoInfo.video.id);
```

That's all there is for videos, for now. Now on to Tiktok audios.

### Audios

Just like Users and Videos, we first need an Audio object.

```javascript
const audio = tiktok.getAudio('6829280451471969029');
```

Take note that getAudio(id) does not return a promise, as it does not fetch any information from the TikTok API.

To get the information related to the audio:

See [AudioInfo](#AudioInfo) for a definition of the AudioInfo object. May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L124).

```javascript
const audioInfo = await tiktok.getAudioInfo(audio);

console.log(audioInfo.title, audioInfo.audio.title);
```

To get the top videos related to an audio:

The first object of this VideoInfo array will be the original video with the audio. May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L145).

```javascript
const topVideos = await tiktok.getAudioTopVideos(audio);

console.log(topVideos[0]);
```

Finally we have TikTok tags.

### Tags

Just like Users, Videos, and Audios, we need a Tag object.

Will fetch the title from the TikTok API, therefore this function returns a promise. May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L158).

```javascript
const tag = await tiktok.getTag('fyp');
```

To retrieve the information associated with the tag:

See [TagInfo](#TagInfo) for a definition of the TagInfo object. May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L169).

```javascript
const tagInfo = await tiktok.getTagInfo(tag);

console.log(tagInfo.description, tagInfo.videoCount, tagInfo.viewCount);
```

To get the top videos of a tag:

May throw an error in certain situations, see [here](./tiktok-app-api/api.ts#L187).

```javascript
const topVideos = await tiktok.getTagTopVideos(tag);

console.log(topVideos);
```

Object Reference
---

Below you will find the data that each object contains.

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
