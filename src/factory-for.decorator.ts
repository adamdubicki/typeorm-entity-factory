import { FACTORY_FOR_KEY } from "./constants";

/**
 * The FactoryContainer maps entity class name strings
 * to their respective factory classes.
 *
 * @example
 * class Book {...}
 *
 * @FactoryFor(Book)
 * class BookFactory {...}
 *
 * Then within the container, the class name passed
 * into factory for is retrieve and mapped.
 *
 * @param entity: The entity class to map to in container
 * @returns TS class decorator function
 */
export const FactoryFor = (Entity: any) => (target: any) => {
  const entityInstance = new Entity();
  const entityName = entityInstance.constructor.name;
  Reflect.defineMetadata(FACTORY_FOR_KEY, entityName, target);
};
