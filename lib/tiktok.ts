import { TikTok } from './types';
import { app } from './app';
import { utility } from './utility';
import { signer } from './signer';

import merge = require('merge-descriptors');

export = tiktok;

async function tiktok(): Promise<TikTok> {
    const newApp = {} as TikTok;

    merge(newApp, app);
    merge(newApp, utility);
    merge(newApp, signer);

    await newApp.init();

    return newApp;
}