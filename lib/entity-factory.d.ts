import { Connection } from 'typeorm';
/**
 * @abstract
 * @author Adam Dubicki
 * @class EntityFactory
 * @summary The Abstract EntityFactory is the class that all registered
 * factories must extend to produce entities.
 *
 * @typeparam E: The Entity that the factory generates
 * @typeparam O: The additional options the make function can take
 */
export declare abstract class EntityFactory<E, O = {}> {
    /** @property connection: The database connection */
    private readonly connection;
    /** @constructor */
    constructor(
    /** @property connection: The database connection */
    connection: Connection);
    make(): void;
    makeOne(): void;
    saveOne(): void;
    saveMany(): void;
}
