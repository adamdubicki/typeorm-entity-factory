import { Connection } from 'typeorm';
import * as Faker from 'faker';

/**
 * @abstract
 * @author Adam Dubicki
 * @class EntityFactory
 * @summary 
 * The Abstract EntityFactory is the class that all registered
 * factories must extend to produce entities.
 * 
 * @typeparam E: The Entity that the factory generates
 * @typeparam O: The additional options the make function can take
 * 
 * @property connection: The database connection 
 */
export abstract class EntityFactory<E, O = {}> {

  protected readonly faker: typeof Faker;

  /** @constructor */
  constructor(
    private readonly connection: Connection
  ){
    this.faker = Faker;
  }

  /**
   * @abstract
   * @public
   * @summary 
   * The make function defines how to create an instance
   * of type E. makeOne, makeMany call this function to
   * generate an entity.
   * 
   * @param
   */
  abstract make(overrideParams?: Partial<E> & O): Promise<E>;

  /**
   * @public
   * @summary
   * Create and insert many entites into the database
   * 
   * @param count: The number of entities to save (default is 1)
   * @param options: The object to override with - passed down into make
   * @returns An array of saved entities
   */
  async saveMany(count = 1, options?: Partial<E> & O): Promise<E[]>{
    const entityArray: E[] = [];

    for await (const index of [...Array(count).keys()]) {
      const entity = await this.make(options);
      entityArray.push(entity);
    }

    return this.connection.manager.save(await Promise.all(entityArray));
  }

  /**
   * @public
   * @summary
   * Create and insert one entity into the database
   * 
   * @param options: The object to override with - passed down into make
   * @returns An entity
   */
  async saveOne(options?: Partial<E> & O): Promise<E> {
    const [ entity ] = (await this.saveMany(1, options));
    return entity;
  }
}