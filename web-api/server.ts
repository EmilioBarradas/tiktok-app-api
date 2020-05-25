const express = require('express');
const tiktok = require('../tiktok-api/api');

const app = express();

app.get('/api/user/:username', getUser);
app.get('/api/user/:user/videos', getUserVideos);

app.get('/api/video/:video', getVideoInfo);

app.listen(8000);

async function getUser(req, res) {
    res.status(200).send(await tiktok.getUser(req.params.username));
}

async function getUserVideos(req, res) {
    const user = isNaN(req.params.user) ? await tiktok.getUser(req.params.user) : { id: req.params.user };
    res.status(200).send(await tiktok.getUserVideos(user));
}

async function getVideoInfo(req, res) {
    const video = await tiktok.getVideo(req.params.video);
    res.status(200).send(await tiktok.getVideoInfo(video));
}