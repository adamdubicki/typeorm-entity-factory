import { FactoryContainer } from './factory-container';
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
 */
export abstract class EntityFactory<E, O = {}> {

  /** 
   * @constructor
   * @property connection: TypeORM Database connection
   * @property container: The factory container
   * acts parent reference for using other factories within a factory
   * @property faker: Faker library for having stub data
   */
  constructor(
    private readonly connection: Connection,
    protected readonly container: FactoryContainer,
    protected readonly faker: typeof Faker = Faker
  ){}

  /**
   * @abstract
   * @public
   * @summary 
   * The make function defines how to create an instance
   * of type E. makeOne, makeMany call this function to
   * generate an entity.
   * 
   * @param overrides: Params to override object with
   * @returns an instance of E
   */
  abstract make(overrides?: Partial<E> & O): Promise<E>;

  /**
   * @public
   * @summary
   * Create and insert many entities into the database
   * 
   * @param count: The number of entities to save (default is 1)
   * @param overrides: The object to override with - passed down into make
   * @returns An array of saved entities
   */
  async saveMany(count = 1, overrides?: Partial<E> & O): Promise<E[]>{
    const entityArray: E[] = [];

    /** Create entities with make, apply override options */
    for await (const index of [...Array(count).keys()]) {
      const entity: E = await this.make(overrides);

      /** 
       * Manually override each key of E.
       * Loop through key of entity, if a value was passed into the override
       * then set it on the entity. This assured we don't save a keyof O onto
       * our entity of type E
       */
      if(overrides) {
        const entityOverrides: Partial<E> = <Partial<E>>Object.assign({}, overrides);
        Object.keys(entity).forEach(key => {
          /** Grab the value at override[key] which is of type E[key] */
          const overrideValue: E[keyof E] | undefined = entityOverrides[key as keyof E]!;

          /** If the override is not undefined, we can set it on the entity */
          if(typeof overrideValue !== undefined) {
            entity[key as keyof E] = overrideValue;
          }

        });
      }

      entityArray.push(entity);
    }

    /** Save all of the entities */
    return this.connection.manager.save(await Promise.all(entityArray));
  }

  /**
   * @public
   * @summary
   * Create and insert one entity into the database
   * 
   * @param overrides: The object to override with - passed down into make()
   * @returns An entity
   */
  async saveOne(overrides?: Partial<E> & O): Promise<E> {
    const [ entity ] = (await this.saveMany(1, overrides));
    return entity;
  }
}