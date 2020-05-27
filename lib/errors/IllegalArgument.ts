export class IllegalArgument extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, IllegalArgument.prototype);
    }
}