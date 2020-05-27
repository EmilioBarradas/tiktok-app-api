import express = require('express');
import tiktok = require('../tiktok-api/api');
import { IllegalIdentifier } from '../tiktok-api/errors/IllegalIdentifier';
import { ResourceNotFound } from '../tiktok-api/errors/ResourceNotFound';

const app = express();

app.get('/api/user/:identifier', getUserInfo);
app.get('/api/user/:identifier/videos', getRecentVideos);
app.get('/api/user/:identifier/liked', getLikedVideos);

app.get('/api/video/:id', getVideoInfo);

app.get('/api/audio/:id', getAudioInfo);
app.get('/api/audio/:id/videos', getAudioTopVideos);

app.get('/api/tag/:id', getTagInfo);
app.get('/api/tag/:id/videos', getTagTopVideos);

app.listen(8000);

async function getUserInfo(req, res) {
    let userInfo;

    try {
        userInfo = await tiktok.getUserInfo(req.params.identifier);
    } catch (err) {
        handleError(err, res);
    }

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

    let videoInfo;
    try {
        videoInfo = await tiktok.getVideoInfo(video);
    } catch (err) {
        handleError(err, res);
    }

    res.status(200).send(videoInfo).end();
}

async function getAudioInfo(req, res) {
    const audio = await tiktok.getAudio(req.params.id);

    let audioInfo;
    try {
        audioInfo = await tiktok.getAudioInfo(audio);
    } catch (err) {
        handleError(err, res);
    }

    res.status(200).send(audioInfo).end();
}

async function getAudioTopVideos(req, res) {
    const audio = await tiktok.getAudio(req.params.id);
    const topVideos = await tiktok.getAudioTopVideos(audio);

    res.status(200).send(topVideos).end();
}

async function getTagInfo(req, res) {
    let tagInfo;
    try {
        tagInfo = await tiktok.getTagInfo(req.params.id);
    } catch (err) {
        handleError(err, res);
    }

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

function handleError(err, res) {
    let statusCode;

    if (err instanceof IllegalIdentifier) {
        statusCode = 400;
    } else if (err instanceof ResourceNotFound) {
        statusCode = 404;
    }

    const body = {
        error: err.message,
    }
    res.status(statusCode).send(body).end();
}