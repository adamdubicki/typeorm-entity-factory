import { Connection, getConnectionManager } from 'typeorm';
import { GenreFactory } from './sample/factories/genre-factory';
import { BookFactory } from './sample/factories/book-factory';
import { FactoryContainer } from '../factory-container';
import { Genre } from './sample/entities/genre';
import { Author } from './sample/entities/author';
import { Book } from './sample/entities/book';

/**
 * Get a sample database connection for a fake postgres database
 * @returns an instantiated database connection string
 */
export const getConnection = async () => {
  const connectionManager = getConnectionManager();
  const connection = connectionManager.create({
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: 'postgres',
    password: 'example',
    database: 'postgres',
    entities: [Book, Genre, Author],
    synchronize: true,
  });
  return connection.connect();
};

/**
 * Get all of the database entities associated with a database connection
 *
 * @param connection: A database connection string
 * @returns an array of objects for name and tablename
 */
export const getDBEntities = (
  connection: Connection,
): { name: string; tableName: string }[] => {
  const entities: { name: string; tableName: string }[] = [];
  connection.entityMetadatas.forEach(({ name, tableName }) => entities.push({
    name,
    tableName,
  }));
  return entities;
};

/**
 * Clear all database tables via connection
 *
 * @param connection: Database connection clear
 * @returns a promise that the Database has been cleared
 */
export const clearDB = async (connection: Connection): Promise<void> => {
  try {
    for await (const entity of getDBEntities(connection)) {
      const repository = connection.getRepository(entity.name);
      await repository.delete({});
    }
  } catch (err) {
    throw new Error(`ERROR: Cleaning test db: ${err}`);
  }
};

/**
 * Get a stub factory container for testing
 * @returns an instantiated container
 */
export const getContainer = async (
  connection: Connection,
): Promise<FactoryContainer> => FactoryContainer.init({
  connection,
  factories: [BookFactory, GenreFactory],
});
