import { EntityFactory } from 'src/entity-factory';
import { IFactoryContainerOptions } from 'src/factory-container-options.interface';
import { Type } from './utils';
import { getFactoryFor } from './factory-for.decorator';

/**
 * @author Adam Dubicki
 * @class FactoryContainer
 * @summary
 * A container object to perform the connection string injection
 * into all of the factories. Maps each of the factories to respective
 * entity class name from reflected metadata.
 */
export class FactoryContainer {
  /** @property factories: A map from EntityName to its factory instance */
  private factories: Map<string, EntityFactory<any>>;

  /**
   * Instantiate a factory container and inject into all of the options.Factories.
   *
   * @param options: A configuration options for the factory container;
   * @returns a configured instance of the factory container
   */
  static async init(
    options: IFactoryContainerOptions,
  ): Promise<FactoryContainer> {
    const container = new FactoryContainer();
    const factories = new Map<string, EntityFactory<any>>();

    /** Instantiate all of the factory classes passed in via config */
    options.factories.forEach(FactoryClass => {
      const { entityName, namespaceKey } = getFactoryFor(FactoryClass);
      const factoryInstance = new FactoryClass(options.connection, container);

      if (!entityName) {
        throw new Error(`
          Unable to get entity metadata for factory ${factoryInstance.constructor.name}.
          This is likely due to the factory not being decorated with the FactoryFor class decorator.
        `);
      }

      /** Disallow duplicate setting */
      const accessKey: string = `${entityName}_${namespaceKey}`;
      const existingValue = factories.get(accessKey);
      if (existingValue) {
        throw new Error(`
          Found duplicate factory for ${entityName}. If you want to use multiple
          factories for an entity, please provide a namespace key to the factory decorators.

          @FactoryFor(${entityName}, <...namespace key ...>)
        `);
      }

      factories.set(accessKey, factoryInstance);
    });

    /** Set the factory map */
    container.factories = factories;

    return container;
  }

  /**
   * Get a factory instance from entityName
   *
   * @param entity: The entity to retrieve the factory for
   * @returns the factory F from the factories map on the container
   */
  public getFactory<K>(entity: Type<K>, namespaceKey = ''): EntityFactory<K> {
    const entityInstance = new ((entity as unknown) as {
      new (...args: any[]): any;
    })();
    const entityName: string = entityInstance?.constructor?.name;
    if (!entityName) {
      throw new Error(`
        Unable to find constructor name for entity parameter.
        This is likely because you did not pass in a class.
      `);
    }

    const factory: EntityFactory<K> | undefined = this.factories.get(
      `${entityName}_${namespaceKey}`,
    );

    if (factory !== undefined) {
      return factory as EntityFactory<K>;
    }

    throw new Error(`
      Unable to retrieve factory instance for key: ${entityName}.
      This could be due to the entity not being passed into the init() function
      on instantiation.

      Possible entities are: ${[...this.factories.keys()]}
    `);
  }
}
