export const TYPE_RECENT_VIDEOS = 1;
export const TYPE_LIKED_VIDEOS  = 2;
export const TYPE_TAG_VIDEOS = 3;
export const TYPE_AUDIO_VIDEOS = 4;
export const TYPE_TRENDING_VIDEOS = 5;

export const ILLEGAL_IDENTIFIER = 10201;
export const RESOURCE_NOT_FOUND = 10202;
export const VIDEO_NOT_FOUND = 10204;

export const PUPPETEER_NOT_FOUND = 
        '\n\n  In order to run tiktok-app-api without an external signature service, '
        + 'you must install puppeteer.'
        + '\n\n\n\t\x1b[4mnpm i puppeteer\x1b[0m\n\n\n'
        + '  Learn more at https://github.com/TikStock/tiktok-app-api#options.\n\n'