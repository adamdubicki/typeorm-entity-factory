import { EntityFactory } from 'src/entity-factory';
import { FactoryFor } from 'src/factory-for.decorator';
import { Book } from 'src/tests/sample/entities/book';
import { Genre } from 'src/tests/sample/entities/genre';

@FactoryFor(Book)
export class BookFactory extends EntityFactory<Book> {
  /**
   * @inheritdoc
   * Create a Book with default parameters
   * @returns a stubbed Book
   */
  async make(): Promise<Book> {
    const book = new Book();
    book.id = this.faker.random.uuid();
    book.title = this.faker.name.title();
    book.genre = await this.container.getFactory(Genre).saveOne();
    return book;
  }
}
