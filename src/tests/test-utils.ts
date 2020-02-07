import { Book } from './sample/entities/book';
import { getConnectionManager, Connection } from "typeorm";

export const getConnection = async () => {
  const connectionManager = getConnectionManager();
  const connection = connectionManager.create({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "postgres",
    password: "example",
    database: "postgres",
    entities: [
      Book
    ],
    synchronize: true
  });
  return await connection.connect();
}

export const getDBEntities = (connection: Connection) => {
  const entities:{ name: string, tableName: string }[] = [];
  connection.entityMetadatas.forEach(x =>
    entities.push({ name: x.name, tableName: x.tableName }),
  );
  return entities;
}

export const clearDB = async (connection: Connection): Promise<void> => {
  try {;
    for (const entity of getDBEntities(connection)) {
      const repository = await connection.getRepository(entity.name);
      await repository
        .createQueryBuilder()
        .delete()
        .execute();
    }
  } catch (err) {
    throw new Error(`ERROR: Cleaning test db: ${err}`);
  }
};