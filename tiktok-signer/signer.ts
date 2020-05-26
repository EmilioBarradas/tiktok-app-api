const Signer = require('tiktok-signature');

const signerSingleton = new Signer();

main();

/**
 * Entry point to signature program.
 */
async function main() {
    await init();
}

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
 * Gets the signature of the url.
 */
async function getSignature(url: string): Promise<string> {
    return await signerSingleton.sign(url);
}

/**
 * Gets the verfication token of the url.
 */
async function getVerifyToken(): Promise<string> {
    return await signerSingleton.getVerifyFp();
}

exports.getSignature = getSignature;
exports.getVerifyToken = getVerifyToken;