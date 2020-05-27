export class ResourceNotFound extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, ResourceNotFound.prototype);
    }
}