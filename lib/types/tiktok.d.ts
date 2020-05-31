import * as core from './core';

/**
 * Creates and initializes a new TikTok application.
 * @returns A promise with the resolved value of a TikTok application object.
 */
declare function tiktok(options?: core.TikTokOptions): Promise<core.TikTok>;

declare namespace tiktok {
    interface TikTokOptions extends core.TikTokOptions { }
    interface User extends core.User { }
    interface UserInfo extends core.UserInfo { }
    interface Video extends core.Video { }
    interface VideoInfo extends core.VideoInfo { }
    interface Audio extends core.Audio { }
    interface AudioInfo extends core.AudioInfo { }
    interface Tag extends core.Tag { }
    interface TagInfo extends core.TagInfo { }
    interface TikTok extends core.TikTok { }
}

export = tiktok;