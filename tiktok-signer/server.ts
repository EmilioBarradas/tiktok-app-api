const express = require('express');
const signer = require('./signer');

const app = express();

app.use(express.json());

app.post('/api/sign/', signURL);

app.listen(4000);

async function signURL(req, res) {
    res.status(200).send(
        {
            signature: await signer.getSignature(req.body.url),
            token: await signer.getVerifyToken()
        }
    ).end();
}