export class IllegalIdentifier extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, IllegalIdentifier.prototype);
    }
}