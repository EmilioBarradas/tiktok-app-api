import { IllegalArgument } from './IllegalArgument';
import { IllegalIdentifier } from './IllegalIdentifier';
import { IllegalOptions } from './IllegalOptions';
import { ResourceNotFound } from './ResourceNotFound';

export const error: any = {};

error.IllegalArgument = IllegalArgument;

error.IllegalIdentifier = IllegalIdentifier;

error.IllegalOptions = IllegalOptions;

error.ResourceNotFound = ResourceNotFound;