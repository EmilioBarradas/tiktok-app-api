const Signer = require('tiktok-signature');

export const signer: any = {};

signer.getNewSigner = async function(): Promise<any> {
    const signer = new Signer();

    await signer.init();

    return signer;
}

signer.sign = async function(url: string): Promise<object> {
    const signature = await this.signer.sign(url);
    const token = await this.signer.getVerifyFp(url);

    return {
        signature: signature,
        token: token,
    }
}