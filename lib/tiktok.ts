import { TikTok, TikTokOptions } from './types/core';
import { app } from './app';
import { utility } from './utility';
import { error } from './errors/error';

import merge = require('merge-descriptors');

export = tiktok;

async function tiktok(options: TikTokOptions = {}): Promise<TikTok> {
    const newApp = {} as TikTok;

    merge(newApp, app);
    merge(newApp, utility);
    merge(newApp, error);

    await newApp.init(options);

    return newApp;
}