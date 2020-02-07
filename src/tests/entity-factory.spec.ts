import * as faker from 'faker';
import { getConnection, clearDB } from './test-utils';
import { Book } from './sample/entities/book';
import { Connection } from 'typeorm';
import { BookFactory } from './sample/factories/book-factory';

describe('entity-factory', () => {

  let bookFactory: BookFactory;
  let connection: Connection;

  beforeAll(async () => {
    connection = await getConnection();
    bookFactory = new BookFactory(connection)
  })

  afterEach(async () => await clearDB(connection));

  afterAll(async () => {
    await clearDB(connection);
    if (connection.isConnected) {
      await connection.close();
    }
  })


  describe('saveOne()', () => {
    
    describe('bookFactory', () => {

      it('can bulk instantiate entities', async() => {
        const book = await bookFactory.saveOne();
        expect(book.id).toBeDefined()
        expect(book.title).toBeDefined();
        
        const [
          savedBooks,
          savedBooksCount
        ] = await connection.manager.findAndCount(Book);
        
        /** Check that the database has been updated with the new book */
        expect(savedBooksCount).toBe(1);
        expect(savedBooksCount).toEqual(savedBooks.length)
        for(const book of savedBooks) {
          expect(book.id).toBeDefined();
          expect(book.title).toBeDefined();
        }
      });

      it('can instantiate a book with partial parameters', async () => {
        const BOOK_TITLE: string = faker.random.words();
        const book = await bookFactory.saveOne({
          title: BOOK_TITLE
        });

        expect(book).toBeDefined();
        expect(book.title).toEqual(BOOK_TITLE);

        const savedBook = await connection.manager.findOne(Book, {
          where: {
            title: BOOK_TITLE
          }
        });

        
        const result = await connection.manager.findAndCount(Book);

        // expect(savedBook).not.toBeNull();
        // expect(savedBook.id).toEqual(book.id);
        // expect(savedBook.title).toEqual(BOOK_TITLE);
      });
    });
  });

  describe('saveMany()', () => {

    describe('bookFactory', () => {

      it('can bulk instantiate entities', async() => {
        const BOOKS_COUNT = 1000;

        const books = await bookFactory.saveMany(BOOKS_COUNT);

        /** Instantiate a large amount of books */
        expect(books.length).toBe(BOOKS_COUNT);
        books.forEach(book => {
          expect(book.id).toBeDefined();
          expect(book.title).toBeDefined();
        });

        const [
          savedBooks,
          savedBooksCount
        ] = await connection.manager.findAndCount(Book);

        /** Check that the saved books are saved and defined */
        expect(savedBooksCount).toEqual(BOOKS_COUNT)
        expect(savedBooksCount).toEqual(savedBooks.length)
        for(const book of savedBooks) {
          expect(book.id).toBeDefined();
          expect(book.title).toBeDefined();
        }
      });
    });
  });
});