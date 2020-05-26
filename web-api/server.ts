import express = require('express');
import tiktok = require('../tiktok-api/api');

const app = express();

app.get('/api/user/:identifier', getUserInfo);
app.get('/api/user/:identifier/videos', getRecentVideos);
app.get('/api/user/:identifier/liked', getLikedVideos);

app.get('/api/video/:id', getVideoInfo);

app.get('/api/audio/:id', getAudioInfo);
app.get('/api/audio/:id/videos', getAudioTopVideos);

app.get('/api/tag/:id', getTagInfo);
app.get('/api/tag/:id', getTagTopVideos);

app.listen(8000);

async function getUserInfo(req, res) {
    const userInfo = await tiktok.getUserInfo(req.params.identifier);

    res.status(200).send(userInfo).end();
}

async function getRecentVideos(req, res) {
    const user = await getUser(req.params.identifier);
    const recentVideos = await tiktok.getRecentVideos(user);

    res.status(200).send(recentVideos).end();
}

async function getLikedVideos(req, res) {
    const user = await getUser(req.params.identifier);
    const likedVideos = await tiktok.getLikedVideos(user);

    res.status(200).send(likedVideos).end();
}

async function getVideoInfo(req, res) {
    const video = await tiktok.getVideo(req.params.id);
    const videoInfo = await tiktok.getVideoInfo(video);

    res.status(200).send(videoInfo).end();
}

async function getAudioInfo(req, res) {
    const audio = await tiktok.getAudio(req.params.id);
    const audioInfo = await tiktok.getAudioInfo(audio);

    res.status(200).send(audioInfo).end();
}

async function getAudioTopVideos(req, res) {
    const audio = await tiktok.getAudio(req.params.id);
    const topVideos = await tiktok.getAudioTopVideos(audio);

    res.status(200).send(topVideos).end();
}

async function getTagInfo(req, res) {
    const tag = await tiktok.getTag(req.params.id);
    const tagInfo = await tiktok.getTagInfo(tag);

    res.status(200).send(tagInfo).end();
}

async function getTagTopVideos(req, res) {
    const tag = await tiktok.getTag(req.params.id);
    const topVideos = await tiktok.getTagTopVideos(tag);

    res.status(200).send(topVideos).end();
}

async function getUser(id: string) {
    return isNaN(Number(id)) ? await tiktok.getUserByName(id) : Promise.resolve(tiktok.getUserByID(id));
}