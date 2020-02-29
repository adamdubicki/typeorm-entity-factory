/**
 * @constant
 * @description
 * string to namespace decorators so that strings will not conflict
 * with other metadata decorators
 */
const DECORATOR_PREFIX: string = 'typeorm-entity-factory';

/**
 * @constant
 * @description
 * Unique retrieval key for FactoryFor() decorator
 */
export const FACTORY_FOR_KEY: string = `${DECORATOR_PREFIX}:FactoryFor`;
