export class IllegalOptions extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, IllegalOptions.prototype);
    }
}