export const TYPE_RECENT_VIDEOS = 8;
export const TYPE_LIKED_VIDEOS  = 9;
export const TYPE_TRENDING_VIDEOS = 12;

export const ILLEGAL_IDENTIFIER = 10201;
export const RESOURCE_NOT_FOUND = 10202;
export const VIDEO_NOT_FOUND = 10204;

export const DEFAULT_SIGNATURE_SERVICE = 'https://35.223.247.100/api/sign';

export const SIGN_URL_ERROR = 'Could not sign an API URL. '
                            + 'This usually means the signature service is not responding. '
                            + 'If you are using the default signature service, create a pull '
                            + 'request at https://github.com/tikstock/tiktok-app-api stating this issue.'
