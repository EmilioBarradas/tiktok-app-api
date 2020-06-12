// @ts-ignore
import tiktok = require('../dist/tiktok');
import { getBody } from '../lib/utility';

import { expect } from 'chai';
import 'mocha';

let app: tiktok.TikTok;

before(async function() {
    app = await tiktok();
});

describe('Application', function() {

    describe('Initialization', function() {

        it('is defined', function() {
            expect(app).to.not.be.undefined;
        });
    });

    describe('Utility', function() {
        it('returned a signed url', async function() {
            const unsignedURL = 'https://example.com';
            const expectedURL = unsignedURL.replace('?', '\\?');

            const signedURL = await app.signURL(unsignedURL);

            expect(signedURL).matches(new RegExp(expectedURL + '&_signature=.+', 'g'));
        });

        it('returned the url body', async function() {
            const url = 'https://jsonplaceholder.typicode.com/users';

            const body = await getBody(url);

            expect(body).to.not.be.empty;
        });

        it('returned tiktok contents', async function() {
            const unsignedURL = 'https://m.tiktok.com/api/item_list/?count=30&id=1&type=5'
                + '&secUid=&maxCursor=0&minCursor=0&sourceType=12&appId=1233';

            const body = await app.getTiktokContent(unsignedURL);

            expect(body).to.not.be.empty;
        });
    });
});

describe('TikTok API', function() {

    describe('Trending Page', function() {
        let videos: tiktok.VideoInfo[];

        before(async function() {
            const it = app.getTrendingVideos();
            const videoResult = await it.next();
            videos = videoResult.value;
        });

        it('returns videoinfos', function() {
            expect(videos).length.greaterThan(0);
        });

        it('has valid videoinfos', function() {
            expect(videos).to.not.be.empty;
            expect(videos).to.satisfy(function(videos: tiktok.VideoInfo[]) {
                return videos.every((video: tiktok.VideoInfo) => video.video != null);
            });
        });
    });

    describe('User', function() {
        let usernameUser: tiktok.User;
        let idUser: tiktok.User;
        let userInfo: tiktok.UserInfo;

        before(async function() {
            usernameUser = await app.getUserByName('example_account');
            idUser = app.getUserByID('6837319235481830405');

            userInfo = await app.getUserInfo('example_account');
        });

        it('getting user by name returns a user', function() {
            expect(usernameUser).to.not.be.undefined;
        });

        it('getting user by name returns a valid user', function() {
            expect(usernameUser).to.have.property('id');
        });

        it('getting user by id returns a user', function() {
            expect(idUser).to.not.be.undefined;
        });

        it('getting user by id returns a valid user', function() {
            expect(idUser).to.have.property('id');
        });

        it('returns userinfo', function() {
            expect(userInfo).to.not.be.undefined;
        });

        it('returns a valid userinfo', function() {
            expect(userInfo).to.have.property('user');
        });
    });

    describe('Uploaded', function() {
        let videos: tiktok.VideoInfo[];

        before(async function() {
            const user = app.getUserByID('6837319235481830405');

            const it = app.getUploadedVideos(user);
            const videoResult = await it.next();
            videos = videoResult.value;
        });

        it('returns 1 videoinfo', function() {
            expect(videos.length).to.equal(1);
        });

        it('is a valid videoinfo', function() {
            expect(videos).to.not.be.empty;
            expect(videos).to.satisfy(function(videos: tiktok.VideoInfo[]) {
                return videos.every((video: tiktok.VideoInfo) => video.video != null);
            });
        });
    });

    describe('Liked', function() {
        let videos: tiktok.VideoInfo[];

        before(async function() {
            const user = app.getUserByID('6837319235481830405');

            const it = app.getUploadedVideos(user);
            const videoResult = await it.next();
            videos = videoResult.value;
        });

        it('returns 1 videoinfo', function() {
            expect(videos.length).to.equal(1);
        });

        it('is a valid videoinfo', function() {
            expect(videos).to.not.be.empty;
            expect(videos).to.satisfy(function(videos: tiktok.VideoInfo[]) {
                return videos.every((video: tiktok.VideoInfo) => video.video != null);
            });
        });
    });

    describe('Video', function() {
        let video: tiktok.Video;

        before(function() {
            video = app.getVideo('6837325177513102597');
        });

        it('returns video', function() {
            expect(video).to.not.be.undefined;
        });

        it('is a valid video', function() {
            expect(video).to.have.property('id');
        });
    });

    describe('VideoInfo', function() {
        let videoInfo: tiktok.VideoInfo;

        before(async function() {
            const video = app.getVideo('6837325177513102597');
            videoInfo = await app.getVideoInfo(video);
        });

        it('returns videoinfo', function() {
            expect(videoInfo).to.not.be.undefined;
        });

        it('is a valid videoinfo', function() {
            expect(videoInfo).to.have.property('video');
        });
    });

    describe('Audio', function() {
        let audio: tiktok.Audio;

        before(function() {
            audio = app.getAudio('6558154638481167375');
        });

        it('returns an audio', function() {
            expect(audio).to.not.be.undefined;
        });

        it('returns a valid audio', function() {
            expect(audio).to.have.property('id');
        });
    });

    describe('AudioInfo', function() {
        let audioInfo: tiktok.AudioInfo;

        before(async function() {
            const audio = app.getAudio('6558154638481167375');
            audioInfo = await app.getAudioInfo(audio);
        });

        it('returns an audioinfo', function() {
            expect(audioInfo).to.not.be.undefined;
        });

        it('returns a valid audioinfo', function() {
            expect(audioInfo).to.have.property('audio');
        });
    });

    describe('Audio Top Videos', function() {
        let videos: tiktok.VideoInfo[];

        before(async function() {
            const audio = app.getAudio('6558154638481167375');
            const it = app.getAudioTopVideos(audio);
            const videoResult = await it.next();
            videos = videoResult.value;
        });

        it('returns videoinfos', function() {
            expect(videos.length).to.be.greaterThan(0);
        });

        it('returns valid videoinfos', function() {
            expect(videos).to.not.be.empty;
            expect(videos).to.satisfy(function(videos: tiktok.VideoInfo[]) {
                return videos.every((video: tiktok.VideoInfo) => video.video != null);
            });
        });
    });

    describe('Tag', function() {
        let tag: tiktok.Tag;

        before(async function() {
            tag = await app.getTag('example');
        });

        it('returns a tag', function() {
            expect(tag).to.not.be.undefined;
        });

        it('correct tag id', function() {
            expect(tag.id).to.equal('9642');
        });
    });

    describe('Tag Info', function() {
        let tagInfo: tiktok.TagInfo;

        before(async function() {
            const tag = await app.getTag('example');
            tagInfo = await app.getTagInfo(tag);
        });

        it('returns a taginfo', function() {
            expect(tagInfo).to.not.be.undefined;
        });

        it('returns a valid taginfo', function() {
            expect(tagInfo).to.have.property('tag');
        });
    });

    describe('Tag Top Videos', function() {
        let videos: tiktok.VideoInfo[];

        before(async function() {
            const tag = await app.getTag('example');
            const it = app.getTagTopVideos(tag);
            const videoResult = await it.next();
            videos = videoResult.value;
        });

        it('returns videoinfos', function() {
            expect(videos.length).to.be.greaterThan(0);
        });

        it('returns valid videoinfos', function() {
            expect(videos).to.satisfy(function(videos: tiktok.VideoInfo[]) {
                return videos.every((video: tiktok.VideoInfo) => video.video != null);
            })
        });
    });

    describe('Errors', function() {

        it('IllegalArgument is defined', function() {
            expect(app.IllegalArgument).to.not.be.undefined;
        });

        it('IllegalIdentifier is defined', function() {
            expect(app.IllegalIdentifier).to.not.be.undefined;
        });

        it('IllegalOptions is defined', function() {
            expect(app.IllegalOptions).to.not.be.undefined;
        });

        it('ResourceNotFound is defined', function() {
            expect(app.ResourceNotFound).to.not.be.undefined;
        });
    });
});