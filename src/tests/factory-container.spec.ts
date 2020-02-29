import { Connection } from 'typeorm';
import { FactoryContainer } from 'src/factory-container';
import { getConnection, clearDB, getContainer } from 'src/tests/test-utils';
import { Book } from 'src/tests/sample/entities/book';
import { Genre } from 'src/tests/sample/entities/genre';

class FakeEntity {}

describe('entity-factory', () => {
  let connection: Connection;
  let container: FactoryContainer;

  beforeAll(async () => {
    connection = await getConnection();
    container = await getContainer(connection);
  });

  afterEach(async () => clearDB(connection));

  afterAll(async () => {
    await clearDB(connection);
    if (connection.isConnected) {
      await connection.close();
    }
  });

  it('can provide for factories with init()', async () => {
    const bookFactory = container.getFactory(Book);
    const genreFactory = container.getFactory(Genre);

    expect(bookFactory).toBeDefined();
    expect(genreFactory).toBeDefined();
    // @ts-ignore TS2345 (Ignore private method)
    expect(bookFactory.faker).toBeDefined();
    // @ts-ignore TS2345 (Ignore private method)
    expect(genreFactory.faker).toBeDefined();
  });

  it('throws error when entity does not exist', async () => {
    let thrownError = null;
    try {
      container.getFactory(FakeEntity);
    } catch (e) {
      thrownError = e;
    }

    expect(thrownError).toBeDefined();
    expect(
      thrownError.message.indexOf(
        'Unable to retrieve factory instance for key: FakeEntity',
      ),
    ).toBeGreaterThanOrEqual(0);
  });
});
