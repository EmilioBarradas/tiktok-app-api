const util = require('util');
const zlib = require('zlib');
const request = require('request');
const merge = require('merge-descriptors');

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

export const utility: any = {};

utility.getTiktokContent = async function(url: string): Promise<object> {
    const signedURL = await this.signURL(url);

    return this.getBody(signedURL);
}

utility.signURL = async function(url: string): Promise<string> {
    let response;

    if (this.options.signatureService) {
        response = await post(this.options.signatureService, { json: { url: url } }).body;
    } else {
        response = await this.sign(url);
    }

    return url + '&verifyFp=' + response.token + '&_signature=' + response.signature;
}

utility.getBody = async function(url: string): Promise<object> {
    const requestOptions = {
        url: url,
    }
    merge(requestOptions, optionsTemplate);

    const response = await get(requestOptions);
    const body = await gunzip(response.body);
    const json = JSON.parse(body.toString());

    return json;
}