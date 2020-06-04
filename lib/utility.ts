import https = require('https');
import http = require('http');
import util = require('util');
import zlib = require('zlib');
import merge = require('merge-descriptors');

import { IncomingMessage } from 'http';
import { VideoInfo, BatchFunction, VideoBatch, GeneratorType } from './types/core';

const gunzip = util.promisify(zlib.gunzip);
const deflate = util.promisify(zlib.deflate);
const brotli = util.promisify(zlib.brotliDecompress);

const getTemplate = {
    headers: {
        'method': 'GET',
        'accept-encoding': 'gzip, deflate, br',
        'referer': 'https://www.tiktok.com/trending?lang=en',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
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
    let body;

    if (this.options.signatureService) {
        body = await post(this.options.signatureService, { url: url });
    } else {
        body = await this.sign(url);
    }

    return url + '&verifyFp=' + body.token + '&_signature=' + body.signature;
}

async function post(urlStr: string, body: object): Promise<object> {
    const url = new URL(urlStr);

    const requestArgs = {
        host: url.hostname,
        port: url.port,
        path: url.pathname,
    }
    merge(requestArgs, postTemplate);

    return new Promise((resolve, reject) => {
        const req = http.request(requestArgs, res => handleResponse(res, resolve));

        req.on('error', reject);

        req.write(JSON.stringify(body));

        req.end();
    });
}

async function getBody(urlStr: string): Promise<object> {
    const url = new URL(urlStr);

    const requestArgs: any = {
        host: url.hostname,
        path: url.pathname + url.search,
    }
    if (url.port) requestArgs.port = url.port;
    merge(requestArgs, getTemplate);

    return new Promise((resolve, reject) => {
        const req = https.get(requestArgs, res => handleResponse(res, resolve));

        req.on('error', reject);
    });
}

function handleResponse(res: IncomingMessage, resolve: Function): void {
    let chunks: any = [];

    res.on('data', chunk => chunks.push(chunk));

    res.on('end', () => convertResponse(chunks, res.headers['content-encoding'], resolve));
}

async function convertResponse(chunks: Buffer[], encoding: string | undefined, resolve: Function): Promise<void> {
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

    resolve(JSON.parse(decodedBuffer.toString()));
}

export function isSignatureInstalled(): boolean {
    try {
        require.resolve('tiktok-signature');
    } catch (err) {
        return false;
    }
    return true;
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