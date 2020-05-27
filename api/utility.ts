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

export async function getTiktokContent(url: string) {
    const signedURL = await sign(url);
    return getBody(signedURL);
}

async function sign(url: string): Promise<string> {
    const response = await post('http://localhost:4000/api/sign', { json: { url: url } });
    return url + '&verifyFp=' + response.body.token + '&_signature=' + response.body.signature;
}

async function getBody(url: string) {
    const requestOptions = { ...optionsTemplate, url: url };

    const response = await get(requestOptions);
    const body = await gunzip(response.body);
    const json = JSON.parse(body.toString());

    return json;
}