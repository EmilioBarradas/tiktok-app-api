export class IllegalIdentifier extends Error {
    constructor(message) {
        super(message);

        Object.setPrototypeOf(this, IllegalIdentifier.prototype);
    }
}