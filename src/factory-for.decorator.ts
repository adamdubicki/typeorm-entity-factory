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
export const FactoryFor = (entity: any) => (target: any) => {
  const entityName: string = new entity()?.constructor?.name;
  Reflect.defineMetadata('typeorm-entity-factory:FactoryFor', entityName, target);
};
