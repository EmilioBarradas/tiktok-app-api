const Signer = require('tiktok-signature');

const signerSingleton = new Signer();

/**
 * Initiates the TikTok URL signer.
 */
async function init() {
    return signerSingleton.init();
}

/**
 * Closes the TikTok URL signer.
 */
async function close() {
    return signerSingleton.close();
}

/**
 * Signs the TikTok url.
 * @param url the URL to sign
 */
async function sign(url: string): Promise<string> {
    const signature = await signerSingleton.sign(url);
    const token = await signerSingleton.getVerifyFp();
    return url + '&verifyFp=' + token + '&_signature=' + signature;
}

exports.init = init;
exports.close = close;
exports.sign = sign;