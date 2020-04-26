/** Private access symbol */
const factoryForKey = Symbol('typeorm-entity-factory:FactoryFor');

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
 * @param namespaceKey: A namespacing string to allow for multiple factories for the same entity
 * @returns TS class decorator function
 */
export const FactoryFor = (entity: any, namespaceKey = '') => (target: any) => {
  const entityName: string = new entity()?.constructor?.name;
  Reflect.defineMetadata(factoryForKey, { entityName, namespaceKey }, target);
};

export function getFactoryFor(
  target: any,
): { entityName: string; namespaceKey: string } {
  return Reflect.getMetadata(factoryForKey, target);
}
