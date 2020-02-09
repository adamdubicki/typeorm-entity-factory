import { GenreFactory } from './sample/factories/genre-factory';
import * as faker from 'faker';
import { Connection } from 'typeorm';
import { FactoryContainer } from './../factory-container';
import { getConnection, clearDB, getContainer } from './test-utils';
import { BookFactory } from './sample/factories/book-factory';

describe('entity-factory', () => {

  let connection: Connection;
  let container: FactoryContainer;

  beforeAll(async () => {
    connection = await getConnection();
    container = await getContainer(connection);
  });

  afterEach(async () => await clearDB(connection));

  afterAll(async () => {
    await clearDB(connection);
    if (connection.isConnected) {
      await connection.close();
    }
  })

  it('can provide for factories with init()', async () => {
    expect(container.getFactory('Book')).toBeDefined();
    expect(container.getFactory('Genre')).toBeDefined();
    expect(true).toBe(true);
  });

  it('throws error when entity does not exist', async () => {
    let thrownError = null;
    const fakeEntityName: string = faker.random.uuid();
    try {
      container.getFactory(fakeEntityName);
    } catch(e) {
      thrownError = e;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError.message.indexOf(`Unable to retrieve factory instance for key: ${fakeEntityName}`)).toBeGreaterThanOrEqual(0);
  });
});