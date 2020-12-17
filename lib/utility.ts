import https = require('https');
import http = require('http');
import util = require('util');
import zlib = require('zlib');
import merge = require('merge-descriptors');

import { IncomingMessage } from 'http';
import { VideoInfo, BatchFunction, GeneratorType, SignatureResponse } from './types/core';
import { DEFAULT_SIGNATURE_SERVICE, SIGN_URL_ERROR } from './constants';

const gunzip = util.promisify(zlib.gunzip);
const deflate = util.promisify(zlib.deflate);
const brotli = util.promisify(zlib.brotliDecompress);

const getTemplate = {
    headers: {
        'method': 'GET',
        'accept-encoding': 'gzip, deflate, br',
        'referer': 'https://www.tiktok.com/trending?lang=en',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
    }
}

const postTemplate = {
    method: 'POST',
    headers: {
        'content-type': 'application/json',
    },
}

export const utility: any = {};

utility.getTiktokContent = async function(url: string): Promise<object> {
    const signedURL = await this.signURL(url);

    return getBody(signedURL);
}

utility.signURL = async function(url: string): Promise<string> {
    const signatureService = this.options.signatureService || DEFAULT_SIGNATURE_SERVICE;

    let body;
    try {
        body = await post(signatureService, { url: url });
    } catch (err) {
        throw Error(SIGN_URL_ERROR);
    }

    // Temporarily removed verification token because it is not required for some URLs.
    return url + '&_signature=' + body.signature + '&verifyFp=' + body.verifyFp;
}

async function post(urlStr: string, body: object): Promise<SignatureResponse> {
    const url = new URL(urlStr);

    const requestArgs = {
        host: url.hostname,
        port: url.port,
        path: url.pathname,
    }
    merge(requestArgs, postTemplate);

    return new Promise((resolve, reject) => {
        const req = http.request(requestArgs, res => handleResponse(res, resolve, reject));

        req.on('error', reject);

        req.write(JSON.stringify(body));

        req.end();
    });
}

export async function getBody(urlStr: string): Promise<object> {
    const url = new URL(urlStr);

    const requestArgs: any = {
        host: url.hostname,
        path: url.pathname + url.search,
    }
    if (url.port) requestArgs.port = url.port;
    merge(requestArgs, getTemplate);

    return new Promise((resolve, reject) => {
        const req = https.get(requestArgs, res => handleResponse(res, resolve, reject));

        req.on('error', reject);
    });
}

function handleResponse(res: IncomingMessage, resolve: Function, reject: Function): void {
    let chunks: any = [];

    res.on('data', chunk => chunks.push(chunk));

    res.on('end', () => convertResponse(chunks, res.headers['content-encoding'], resolve, reject));
}

async function convertResponse(chunks: Buffer[], encoding: string | undefined, resolve: Function, reject: Function): Promise<void> {
    const buffer = Buffer.concat(chunks);

    let decodedBuffer: Buffer;
    if (encoding === 'gzip') {
        decodedBuffer = <Buffer> await gunzip(buffer);
    } else if (encoding === 'deflate') {
        decodedBuffer = <Buffer> await deflate(buffer);
    } else if (encoding === 'br') {
        decodedBuffer = await brotli(buffer);
    } else {
        decodedBuffer = buffer;
    }

    const string = decodedBuffer.toString();

    if (string.length == 0) {
        reject("TikTok sent back an empty response. This is not supposed to happen. Report it if you can.");
        return;
    }

    resolve(JSON.parse(decodedBuffer.toString()));
}

export async function* getVideoGenerator(subset: BatchFunction, count: number,
        startCur: string, type: GeneratorType): AsyncGenerator<VideoInfo[]> {
    let nextCur = startCur;

    while (true) {
        const batch = await subset(count, nextCur, type);
        nextCur = batch.cur;

        if (batch.videos.length === 0) {
            return [];
        }

        yield batch.videos;
    }
}