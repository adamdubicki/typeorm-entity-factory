import { EntityFactory } from ".";
import { IFactoryContainerOptions } from './factory-container-options.interface';

/**
 * @author Adam Dubicki
 * @class FactoryContainer
 * @summary
 * A container object to perform the connection string injection
 * into all of the factories. Maps each of the factories to respective
 * entity class name from reflected metadata.
 */
export class FactoryContainer {

  /**
   * @constructor
   * @private
   * The constructor is private to force instantiation through static init()
   * @property factories: A map from EntityName to its factory instance
   */
  private constructor(
    private factories: Map<string, EntityFactory<any, any>>
  ){}

  /**
   * Instantiate a factory container and inject into all of the options.Factories.
   * 
   * @param options: A configuration options for the factory container;
   * @returns a configured instance of the factory container
   */
  static async init(options: IFactoryContainerOptions) {

    /** 
     * Loop through the array of factory classes
     * and inject the connection string.
     */
    const factories = new Map<string, EntityFactory<any, any>>();
    options.factories.forEach(FactoryClass => {
      const entityName: string = Reflect.getMetadata('MyClassDecoratorKey', FactoryClass);
      const factoryInstance = new FactoryClass(options.connection);

      if(!entityName) {
        throw new Error(`
          Unable to get entity metadata for factory ${factoryInstance.constructor.name}.
          This is likely due to the factory not being decorated with the FactoryFor class decorator.
        `);
      }

      factories.set(entityName, factoryInstance);
    });

    return new FactoryContainer(factories);
  }

  /**
   * Get a factory instance from entityName
   * 
   * @param entityName: The name of the entity to retrieve the factory for
   * @returns the factory F from the factories map on the container
   */
  public getFactory<F extends EntityFactory<any, any>>(entityName: string): F {
    const factory: EntityFactory<any, any> | undefined = this.factories.get(entityName);
    
    if(factory !== undefined) {
      return factory as F;
    }

    throw new Error(`
      Unable to retrieve factory instance for key: ${entityName}.
      This could be due to the entity not being passed into the init() function
      on instantiation.

      Possible entities are: ${[ ...this.factories.keys() ]}
    `);
  }
}